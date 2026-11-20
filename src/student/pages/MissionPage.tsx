import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMission, getModule, missions } from '../content';
import { themeFor } from '../../lib/theme';
import { Markdown } from '../../components/Markdown';
import { Bolt } from '../../components/Mascot';
import { useChecks, useDone } from '../store';

export default function MissionPage() {
  const { moduleId = '', n = '1' } = useParams();
  const mission = getMission(moduleId, Number(n));
  const m = getModule(moduleId);
  const [checks, setChecks] = useChecks();
  const [done, setDone] = useDone();
  const [party, setParty] = useState(false);
  const [total, setTotal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const id = mission?.id ?? '';
  const mine = checks[id] ?? [];
  const ticked = mine.filter(Boolean).length;

  // Turn the markdown task-list checkboxes into real, saved checkboxes.
  useEffect(() => {
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

  return (
    <div className="narrow wide-ish">
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
            <p>Show your teacher to claim up to <b>+{mission.xp} XP</b> for your house!</p>
            <div className="row center">
              <button className="btn ghost" onClick={() => setParty(false)}>
                Keep looking
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
          <small>MISSION {mission.number} · {done.includes(id) ? 'COMPLETE ✔' : 'IN PROGRESS'}</small>
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

      <div ref={ref}>
        <Markdown source={mission.body} className="mission-md" />
      </div>

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
