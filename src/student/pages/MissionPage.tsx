import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMission, getModule, missions } from '../content';
import { themeFor } from '../../lib/theme';
import { Markdown } from '../../components/Markdown';
import { Bolt } from '../../components/Mascot';
import { today, useActiveDays, useChecks, useDone, useLearnMode, useShowcase } from '../store';
import { guidesIn, HELP_PROMPT, STUCK_LADDER } from '../toolGuides';
import { wordsFor, type WordHelp } from '../words';
import { CopyBox } from '../components/CopyBox';

const FEELS = [
  ['😎', 'Easy'],
  ['🙂', 'Good'],
  ['🤔', 'Tricky'],
  ['😵', 'Lost']
];

// Wrap the first use of each word-card word in a tap-to-explain button.
function addWordTips(root: HTMLElement, words: WordHelp[], key: string) {
  // Run once per mission. (A re-render with new mission text replaces the HTML.)
  if (root.dataset.tips === key && root.querySelector('.md')?.getAttribute('data-k') === key) return;
  root.dataset.tips = key;
  root.querySelector('.md')?.setAttribute('data-k', key);
  const used = new Set<string>();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      (n.parentElement?.closest('pre, code, h1, h2, button, a, .word-tip, .solo-card strong, .group-card strong') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT)
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    let cur: Text | null = node;
    for (const w of words) {
      if (!cur || used.has(w.term)) continue;
      const m = cur.data.match(w.re);
      if (!m || m.index === undefined) continue;
      used.add(w.term);
      const after = cur.splitText(m.index);
      const rest = after.splitText(m[0].length);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'word-tip';
      btn.dataset.term = w.term;
      btn.textContent = after.data;
      after.replaceWith(btn);
      cur = rest;
    }
  }
}

export default function MissionPage() {
  const { moduleId = '', n = '1' } = useParams();
  const mission = getMission(moduleId, Number(n));
  const m = getModule(moduleId);
  const [checks, setChecks] = useChecks();
  const [done, setDone] = useDone();
  const [days, setDays] = useActiveDays();
  const [showcase, setShowcase] = useShowcase();
  const [party, setParty] = useState(false);
  const [mode] = useLearnMode();
  const [total, setTotal] = useState(0);
  const [tip, setTip] = useState<WordHelp | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = mission?.id ?? '';
  const mine = checks[id] ?? [];
  const ticked = mine.filter(Boolean).length;
  const words = useMemo(() => wordsFor(moduleId), [moduleId]);
  const tools = useMemo(() => (mission ? guidesIn(mission.body, mission.module) : []), [mission]);
  const newWords = useMemo(() => (mission ? words.filter((w) => w.re.test(mission.body)).slice(0, 8) : []), [mission, words]);
  const shown = showcase[id] ?? { link: '', note: '', date: '' };

  useEffect(() => {
    setTip(null);
  }, [id]);

  // Turn the markdown task-list checkboxes into real, saved checkboxes.
  useEffect(() => {
    if (ref.current) addWordTips(ref.current, words, id);
    const boxes = [...(ref.current?.querySelectorAll<HTMLInputElement>('input[type=checkbox]') ?? [])];
    setTotal(boxes.length);
    boxes.forEach((b, i) => {
      b.disabled = false;
      b.checked = !!mine[i];
      b.closest('li')?.classList.toggle('ticked', b.checked);
      b.onchange = () => {
        const nextChecks = [...(checks[id] ?? [])];
        nextChecks[i] = b.checked;
        setChecks({ ...checks, [id]: nextChecks });
        if (b.checked && !days.includes(today())) setDays([...days, today()]);
        const all = boxes.every((x) => x.checked);
        if (all && !done.includes(id)) {
          setDone([...done, id]);
          setParty(true);
        }
      };
    });
  });

  if (!mission || !m) return <p>Mission not found.</p>;
  const t = themeFor(m.number);
  const idx = missions.findIndex((x) => x.id === id);
  const next = missions[idx + 1];
  const prev = missions[idx - 1];
  const pct = total ? Math.round((ticked / total) * 100) : 0;
  const save = (patch: Partial<typeof shown>) => setShowcase({ ...showcase, [id]: { ...shown, ...patch, date: today() } });

  const onBodyClick = (e: React.MouseEvent) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('.word-tip');
    if (!b) return;
    setTip(words.find((w) => w.term === b.dataset.term) ?? null);
  };

  return (
    <div className={`narrow wide-ish mode-${mode}`}>
      {party && (
        <div className="celebrate" onClick={() => setParty(false)}>
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 40 }).map((_, i) => (
              <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 10) * 0.08}s`, background: ['#ff5fa2', '#ffc800', '#1cb0f6', '#14c38e', '#7c5cff'][i % 5] }} />
            ))}
          </div>
          <div className="celebrate-card" onClick={(e) => e.stopPropagation()}>
            <Bolt size={120} mood="wow" />
            <h2>Mission complete!</h2>
            <p>
              Show your teacher. You can win up to <b>+{mission.xp} XP</b>! Then save what you made in your Showcase below.
            </p>
            <div className="row center">
              <button
                className="btn ghost"
                onClick={() => {
                  setParty(false);
                  setTimeout(() => document.getElementById('showcase-box')?.scrollIntoView({ behavior: 'smooth' }), 50);
                }}
              >
                Save to Showcase
              </button>
              {next && (
                <Link className="btn primary" to={`/m/${next.module}/l/${next.number}`} onClick={() => setParty(false)}>
                  Next mission →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="crumbs">
        <Link to="/">
          {t.icon} Quest {m.number}: {m.title}
        </Link>
        <span>Mission {mission.number}</span>
      </div>

      <div className="unit-banner big" style={{ '--c': t.color, '--s': t.shade } as React.CSSProperties}>
        <div>
          <small>
            MISSION {mission.number} · {done.includes(id) ? 'COMPLETE ✔' : 'IN PROGRESS'}
          </small>
          <h1>{mission.title}</h1>
          <p className="mission-line">🎯 {mission.mission}</p>
          <div className="banner-progress">
            <div style={{ width: `${pct}%` }} />
          </div>
          <small>
            {ticked}/{total} steps done
          </small>
        </div>
        <div className="xp-pill">+{mission.xp} XP</div>
      </div>

      <section className="card before-start">
        <h2>🎒 Before you start</h2>
        <div className="before-grid">
          <div>
            <small>⏱️ TIME</small>
            <b>{mode === 'solo' ? 'About 60 minutes with your teacher' : 'About 90 minutes with your group'}</b>
          </div>
          <div>
            <small>✅ HOW TO WIN</small>
            <b>Tick every box in "Your build". Then show your teacher.</b>
          </div>
        </div>
        {tools.length > 0 && (
          <>
            <small className="eyebrow">🧰 TOOLS YOU'LL USE · tap for a step-by-step guide</small>
            <div className="tool-chips">
              {tools.map((g) => (
                <Link key={g.id} to={`/tools/${g.id}`} className="tool-chip" style={{ '--c': g.color } as React.CSSProperties}>
                  {g.icon} {g.name}
                </Link>
              ))}
            </div>
          </>
        )}
        {newWords.length > 0 && (
          <>
            <small className="eyebrow">📖 WORDS YOU'LL MEET · tap any underlined word below to see what it means</small>
            <div className="tool-chips">
              {newWords.map((w) => (
                <button key={w.term} className="word-chip" onClick={() => setTip(w)}>
                  {w.term}
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      {tip && (
        <div className="word-pop" role="dialog" aria-label={tip.term}>
          <button className="iconbtn" onClick={() => setTip(null)} aria-label="Close">
            ✕
          </button>
          <b>📖 {tip.term}</b>
          <p>{tip.definition}</p>
          {tip.analogy && <p className="muted">💭 Like: {tip.analogy}</p>}
        </div>
      )}

      <div ref={ref} onClick={onBodyClick}>
        <Markdown source={mission.body} className="mission-md" />
      </div>

      <section className="card stuck-card">
        <h2>🆘 Stuck? Climb the help ladder</h2>
        <ol className="ladder">
          {STUCK_LADDER.map((s) => (
            <li key={s.title}>
              <span>{s.icon}</span>
              <div>
                <b>{s.title}</b>
                <small>{s.text}</small>
              </div>
            </li>
          ))}
        </ol>
        <CopyBox label="Help prompt: copy, fill in, paste into Claude or Gemini" text={HELP_PROMPT} />
      </section>

      <section className="card" id="showcase-box">
        <h2>🖼️ Save what you made</h2>
        <p className="muted small">It goes in My Showcase. By Demo Day you'll have a full portfolio!</p>
        <label className="field">
          <b>Link (optional)</b>
          <input placeholder="https://… (your artifact, site, video or picture link)" value={shown.link} onChange={(e) => save({ link: e.target.value })} />
        </label>
        <label className="field">
          <b>What I made, and one thing I'm proud of</b>
          <textarea rows={2} placeholder="I made… I'm proud of…" value={shown.note} onChange={(e) => save({ note: e.target.value })} />
        </label>
        <b>How did this mission feel?</b>
        <div className="feel-pick">
          {FEELS.map(([e, label]) => (
            <button key={e} className={shown.feel === e ? 'on' : ''} onClick={() => save({ feel: e })}>
              <span>{e}</span>
              <small>{label}</small>
            </button>
          ))}
        </div>
        {shown.feel === '😵' && <p className="hint-note">That's OK! Tell your teacher which step lost you. Try the help ladder above, too.</p>}
      </section>

      <div className="pager">
        {prev ? (
          <Link className="btn ghost" to={`/m/${prev.module}/l/${prev.number}`}>
            ← Previous
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="btn primary" to={`/m/${next.module}/l/${next.number}`}>
            Next mission →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
