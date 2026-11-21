import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Lesson } from '../types';
import { SEGMENT_STYLE } from '../lib/theme';
import { COACH } from '../lib/coachMoves';
import { Markdown } from './Markdown';
import { Bolt } from './Mascot';
import { studentMissionUrl } from '../lib/links';

type Mode = 'solo' | 'group';

/** Split a lesson body into its numbered segments and extra sections. */
export function splitLesson(body: string) {
  const parts = body.split(/^(?=## )/m);
  const seg: Record<number, string> = {};
  let intro = '';
  let visuals = '';
  let diff = '';
  for (const p of parts) {
    const n = p.match(/^## (\d)\./);
    if (n) seg[Number(n[1])] = p.replace(/^## .*\n/, '').replace(/\n---\s*$/, '');
    else if (/^## Visuals/.test(p)) visuals = p.replace(/^## .*\n/, '');
    else if (/^## Differentiation/.test(p)) diff = p.replace(/^## .*\n/, '');
    else if (/^## (Lesson objectives|Words for today)/.test(p)) intro += p;
  }
  return { seg, intro, visuals, diff };
}

/** A donut "lesson clock" showing how the time is split. */
export function LessonClock({ lesson, mode, active }: { lesson: Lesson; mode: Mode; active?: number }) {
  const mins = lesson.segments.map((s) => (mode === 'solo' ? s.solo : s.minutes));
  const total = mins.reduce((a, b) => a + b, 0);
  const R = 60;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <svg viewBox="0 0 160 160" className="lesson-clock" role="img" aria-label={`Lesson clock, ${total} minutes`}>
      {lesson.segments.map((s, i) => {
        const st = SEGMENT_STYLE[s.name];
        const len = (mins[i] / total) * C;
        const el = (
          <circle
            key={s.name}
            cx="80"
            cy="80"
            r={R}
            fill="none"
            stroke={st?.color ?? '#ccc'}
            strokeWidth={active === i + 1 ? 30 : 22}
            strokeDasharray={`${len - 2} ${C - len + 2}`}
            strokeDashoffset={-acc}
            opacity={active && active !== i + 1 ? 0.35 : 1}
            transform="rotate(-90 80 80)"
          />
        );
        acc += len;
        return el;
      })}
      <text x="80" y="76" textAnchor="middle" className="clock-num">
        {total}
      </text>
      <text x="80" y="96" textAnchor="middle" className="clock-lbl">
        minutes
      </text>
    </svg>
  );
}

function Timer({ minutes, resetKey }: { minutes: number; resetKey: string | number }) {
  const [left, setLeft] = useState(minutes * 60);
  const [run, setRun] = useState(false);
  useEffect(() => {
    setLeft(minutes * 60);
    setRun(false);
  }, [minutes, resetKey]);
  useEffect(() => {
    if (!run || left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [run, left]);
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, '0');
  return (
    <div className={`coach-timer ${left === 0 ? 'done' : left <= 60 ? 'low' : ''}`}>
      <b>
        {mm}:{ss}
      </b>
      <div className="row">
        <button className="btn small primary" onClick={() => setRun(!run)}>
          {run ? '⏸ Pause' : left === 0 ? '⏰ Time!' : '▶ Start'}
        </button>
        <button className="btn small ghost" onClick={() => setLeft(minutes * 60)}>
          ↺
        </button>
      </div>
    </div>
  );
}

export default function CoachMode({ lesson, mode, onClose, onFinish }: { lesson: Lesson; mode: Mode; onClose: () => void; onFinish: () => void }) {
  const { seg, intro, visuals, diff } = useMemo(() => splitLesson(lesson.body), [lesson.body]);
  const steps = lesson.segments.length + 2; // before class + segments + after class
  const [i, setI] = useState(0);
  const [prepDone, setPrepDone] = useState<boolean[]>([]);
  const go = (d: number) => setI((x) => Math.min(steps - 1, Math.max(0, x + d)));

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, textarea')) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });

  const s = i >= 1 && i <= lesson.segments.length ? lesson.segments[i - 1] : null;
  const st = s ? SEGMENT_STYLE[s.name] : null;
  const coach = s ? COACH[s.name] : null;
  const segMin = s ? (mode === 'solo' ? s.solo : s.minutes) : 0;

  return (
    <div className={`coach-overlay mode-${mode}`} role="dialog" aria-label="Coach mode">
      <div className="coach-top">
        <button className="btn ghost small" onClick={onClose}>
          ✕ Exit
        </button>
        <div className="coach-dots">
          {Array.from({ length: steps }).map((_, k) => {
            const ss = k >= 1 && k <= lesson.segments.length ? SEGMENT_STYLE[lesson.segments[k - 1].name] : null;
            return (
              <button
                key={k}
                className={`dot ${k === i ? 'on' : ''} ${k < i ? 'past' : ''}`}
                style={{ '--c': ss?.color ?? '#1e1b4b' } as React.CSSProperties}
                onClick={() => setI(k)}
                title={k === 0 ? 'Before class' : k === steps - 1 ? 'After class' : lesson.segments[k - 1].name}
              >
                {k === 0 ? '📋' : k === steps - 1 ? '🏁' : ss?.icon}
              </button>
            );
          })}
        </div>
        <small className="muted">
          Step {i + 1} of {steps} · ← → keys
        </small>
      </div>

      <div className="coach-body">
        {i === 0 && (
          <div className="coach-step">
            <div className="coach-hero" style={{ '--c': '#1e1b4b' } as React.CSSProperties}>
              <span className="coach-big-icon">📋</span>
              <div>
                <small>STEP 1 · BEFORE CLASS</small>
                <h1>{lesson.title}</h1>
                <p>{lesson.goal}</p>
              </div>
              <LessonClock lesson={lesson} mode={mode} />
            </div>
            <div className="coach-grid">
              <div className="card">
                <h3>✅ Get ready (tick as you go)</h3>
                <ul className="tick-list">
                  {lesson.prep.map((p, k) => (
                    <li key={p}>
                      <label>
                        <input type="checkbox" checked={!!prepDone[k]} onChange={() => setPrepDone(Object.assign([...prepDone], { [k]: !prepDone[k] }))} />
                        <span>{p}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <h3>🧰 Open these tabs</h3>
                <ul>
                  {lesson.tools.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <a className="btn ghost small" href={studentMissionUrl(lesson.module, lesson.number)} target="_blank" rel="noreferrer">
                  🎒 Copy the student mission link ↗
                </a>
              </div>
              <div className="card">
                <h3>🗺️ The plan at a glance</h3>
                <ol className="glance">
                  {lesson.segments.map((x, k) => {
                    const sx = SEGMENT_STYLE[x.name];
                    return (
                      <li key={x.name} style={{ '--c': sx?.color } as React.CSSProperties}>
                        <span>{sx?.icon}</span>
                        <b>{x.name}</b>
                        <small>{mode === 'solo' ? x.solo : x.minutes} min</small>
                        <button className="btn ghost small" onClick={() => setI(k + 1)}>
                          Go
                        </button>
                      </li>
                    );
                  })}
                </ol>
                <details>
                  <summary>🎯 Goals and new words</summary>
                  <Markdown source={intro} />
                </details>
                {visuals && (
                  <details>
                    <summary>🎨 Visuals to make before class (copy into Gemini)</summary>
                    <Markdown source={visuals} />
                  </details>
                )}
              </div>
            </div>
          </div>
        )}

        {s && st && coach && (
          <div className="coach-step">
            <div className="coach-hero" style={{ '--c': st.color } as React.CSSProperties}>
              <span className="coach-big-icon">{st.icon}</span>
              <div>
                <small>
                  STEP {i + 1} · {segMin} MIN
                </small>
                <h1>{s.name}</h1>
                <p>{coach.goal}</p>
              </div>
              <Timer minutes={segMin} resetKey={i} />
            </div>
            <div className="move-row">
              {coach.moves.map((m, k) => (
                <div key={m.title} className="move" style={{ '--c': st.color } as React.CSSProperties}>
                  <span className="move-n">{k + 1}</span>
                  <span className="move-icon">{m.icon}</span>
                  <b>{m.title}</b>
                  <small>{m.text}</small>
                </div>
              ))}
            </div>
            <div className="coach-grid wide-left">
              <div className="card coach-content">
                <h3>📖 What happens in this part</h3>
                <Markdown source={seg[i] ?? ''} />
              </div>
              <div>
                <div className="card done-card">
                  <h3>🏁 Done when…</h3>
                  <p>{coach.doneWhen}</p>
                </div>
                <div className="card stuck-card">
                  <h3>🆘 If it's not working</h3>
                  <p>{coach.ifStuck}</p>
                </div>
                {s.name === 'Hands-on build' && diff && (
                  <details className="card">
                    <summary>
                      <b>🪜 Too hard? Too easy?</b>
                    </summary>
                    <Markdown source={diff} />
                  </details>
                )}
                {s.name === 'Warm-up' && (
                  <Link className="btn ghost small" to="/arcade" onClick={onClose}>
                    🕹️ Open the Word Arcade
                  </Link>
                )}
                <p className="muted small">🧠 Why this works: {s.principle}</p>
              </div>
            </div>
          </div>
        )}

        {i === steps - 1 && (
          <div className="coach-step center-text">
            <Bolt size={130} mood="wow" />
            <h1>🏁 Lesson done. Great teaching!</h1>
            <div className="move-row">
              {[
                { icon: '✅', title: 'Mark as taught', text: 'So "Next up" moves to the next lesson.' },
                { icon: '⭐', title: 'Award XP', text: `Up to +${lesson.xp} XP. 2 clicks per student in the XP tracker.` },
                { icon: '📝', title: 'Write one note', text: 'What worked? What to repeat next time?' },
                { icon: '📣', title: 'Tease next lesson', text: 'One sentence: "Next time, you\'ll…"' }
              ].map((m, k) => (
                <div key={m.title} className="move" style={{ '--c': '#14c38e' } as React.CSSProperties}>
                  <span className="move-n">{k + 1}</span>
                  <span className="move-icon">{m.icon}</span>
                  <b>{m.title}</b>
                  <small>{m.text}</small>
                </div>
              ))}
            </div>
            <div className="row center">
              <button className="btn gold" onClick={onFinish}>
                ✓ Mark as taught & award XP
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="coach-nav">
        <button className="btn ghost" onClick={() => go(-1)} disabled={i === 0}>
          ← Back
        </button>
        <button className="btn primary" onClick={() => go(1)} disabled={i === steps - 1}>
          {i === 0 ? "I'm ready. Start! →" : 'Next step →'}
        </button>
      </div>
    </div>
  );
}
