import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getModule, lessons } from '../lib/content';
import { useProgress } from '../lib/progress';
import { KEYS, useStored } from '../lib/storage';
import { Markdown } from '../components/Markdown';
import { Bolt } from '../components/Mascot';
import { SEGMENT_STYLE, themeFor } from '../lib/theme';

function Celebrate({ xp, onClose, nextTo }: { xp: number; onClose: () => void; nextTo?: string }) {
  return (
    <div className="celebrate" onClick={onClose}>
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 10) * 0.08}s`, background: ['#ff5fa2', '#ffc800', '#1cb0f6', '#14c38e', '#7c5cff'][i % 5] }} />
        ))}
      </div>
      <div className="celebrate-card" onClick={(e) => e.stopPropagation()}>
        <Bolt size={120} mood="wow" />
        <h2>Lesson complete!</h2>
        <p>
          Up to <b>+{xp} XP</b> for each student. Award it in the tracker.
        </p>
        <div className="row center">
          <Link className="btn gold" to="/tracker">
            ⭐ Award XP
          </Link>
          {nextTo && (
            <Link className="btn primary" to={nextTo} onClick={onClose}>
              Next lesson →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LessonPage() {
  const { moduleId = '', n = '1' } = useParams();
  const idx = lessons.findIndex((l) => l.module === moduleId && l.number === Number(n));
  const lesson = lessons[idx];
  const m = getModule(moduleId);
  const { isTaught, toggle } = useProgress();
  const [notes, setNotes] = useStored<Record<string, string>>(KEYS.notes, {});
  const [present, setPresent] = useState(false);
  const [party, setParty] = useState(false);

  if (!lesson || !m) return <p>Lesson not found.</p>;
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];
  const t = themeFor(m.number);
  const taught = isTaught(lesson.id);
  let clock = 0;

  const markTaught = () => {
    if (!taught) setParty(true);
    toggle(lesson.id);
  };

  return (
    <div className={`lesson narrow wide-ish ${present ? 'present' : ''}`}>
      {party && <Celebrate xp={lesson.xp} onClose={() => setParty(false)} nextTo={next ? `/m/${next.module}/l/${next.number}` : undefined} />}

      <div className="crumbs no-print">
        <Link to={`/m/${m.id}`}>
          {t.icon} Module {m.number}: {m.title}
        </Link>
        <span>
          Lesson {lesson.number} of {lessons.filter((l) => l.module === m.id).length}
        </span>
      </div>

      <div className="unit-banner big lesson-banner" style={{ '--c': t.color, '--s': t.shade } as React.CSSProperties}>
        <div>
          <small>
            LESSON {lesson.number} · COURSE LESSON {lesson.courseNumber}/70 · 90 MIN
          </small>
          <h1>{lesson.title}</h1>
          <p>{lesson.goal}</p>
        </div>
        <div className="xp-pill">+{lesson.xp} XP</div>
      </div>

      <div className="actions no-print">
        <button className={`btn ${taught ? 'gold' : 'primary'}`} onClick={markTaught}>
          {taught ? '✔ Taught' : '✓ Mark as taught'}
        </button>
        <button className="btn ghost" onClick={() => setPresent((p) => !p)}>
          {present ? 'Exit present mode' : '📽️ Present mode'}
        </button>
        <button className="btn ghost" onClick={() => window.print()}>
          🖨️ Print / PDF
        </button>
        <a className="btn ghost" href="#visuals" onClick={(e) => { e.preventDefault(); document.getElementById('visuals')?.scrollIntoView({ behavior: 'smooth' }); }}>
          🎨 Visuals
        </a>
      </div>

      <div className="steps">
        {lesson.segments.map((s) => {
          const st = SEGMENT_STYLE[s.name] ?? { icon: '•', color: '#94a3b8', shade: '#64748b', n: 0 };
          const start = clock;
          clock += s.minutes;
          return (
            <button
              key={s.name}
              className="step"
              style={{ '--c': st.color, '--s': st.shade, flexGrow: s.minutes } as React.CSSProperties}
              onClick={() => document.getElementById(`seg-${st.n}`)?.scrollIntoView({ behavior: 'smooth' })}
              title={s.principle}
            >
              <span className="step-icon">{st.icon}</span>
              <b>{s.name}</b>
              <small>
                {s.minutes} min · {start}–{clock}′
              </small>
            </button>
          );
        })}
      </div>

      <div className="grid2">
        <div className="card">
          <h3>🧰 Tools</h3>
          <ul className="checklist">
            {lesson.tools.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>📋 Prep before class</h3>
          <ul className="checklist">
            {lesson.prep.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <details className="card principles">
        <summary>🧠 The learning science behind each segment</summary>
        <div className="principle-list">
          {lesson.segments.map((s) => (
            <div key={s.name}>
              <span>{SEGMENT_STYLE[s.name]?.icon}</span>
              <div>
                <b>{s.name}</b>
                <p>{s.principle}</p>
              </div>
            </div>
          ))}
        </div>
      </details>

      <Markdown source={lesson.body} />

      <div className="card no-print">
        <h3>📝 My private notes</h3>
        <textarea
          rows={4}
          placeholder="What worked, what to change next year, who needs follow-up…"
          value={notes[lesson.id] || ''}
          onChange={(e) => setNotes({ ...notes, [lesson.id]: e.target.value })}
        />
        <small className="muted">Saved on this device only.</small>
      </div>

      <div className="pager no-print">
        {prev ? (
          <Link className="btn ghost" to={`/m/${prev.module}/l/${prev.number}`}>
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="btn primary" to={`/m/${next.module}/l/${next.number}`}>
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
