import { Link } from 'react-router-dom';
import { course, missions, missionsFor } from '../content';
import { themeFor } from '../../lib/theme';
import { LessonPath, LockedPath } from '../../components/LessonPath';
import { MascotSays } from '../../components/Mascot';
import { HOUSES, useDone, useGuildCard } from '../store';

export default function Home() {
  const [done] = useDone();
  const [card] = useGuildCard();
  const next = missions.find((m) => !done.includes(m.id));
  const xp = missions.filter((m) => done.includes(m.id)).reduce((s, m) => s + m.xp, 0);
  const house = HOUSES.find((h) => h.name === card.house);

  return (
    <div className="with-rail">
      <section className="center-col">
        <MascotSays mood="happy">
          {card.nickname ? <>Hey {card.nickname}! </> : <>Hey Creator! </>}
          {next ? (
            <>
              Your next mission: <b>{next.title}</b>
            </>
          ) : (
            <>You finished every mission so far! 🎉</>
          )}
        </MascotSays>

        {course.modules.map((m) => {
          const t = themeFor(m.number);
          const ms = missionsFor(m.id);
          const d = ms.filter((x) => done.includes(x.id)).length;
          const ready = ms.length > 0;
          return (
            <div key={m.id} className="unit" id={m.id}>
              <div className={`unit-banner ${ready ? '' : 'is-locked'}`} style={{ '--c': t.color, '--s': t.shade } as React.CSSProperties}>
                <div>
                  <small>QUEST {m.number}</small>
                  <h2>{m.title}</h2>
                  <small className="unit-sub">{ready ? `${d}/${ms.length} missions complete` : 'Unlocks soon'}</small>
                </div>
                <span className="unit-icon">{t.icon}</span>
              </div>
              {ready ? (
                <LessonPath lessons={ms} isTaught={(id) => done.includes(id)} nextId={next?.id} />
              ) : (
                <LockedPath count={m.lessons} icon={t.icon} />
              )}
            </div>
          );
        })}
      </section>

      <aside className="rail">
        <div className="card rail-card guild-mini" style={{ borderColor: house?.color ?? 'var(--line)' }}>
          {card.nickname ? (
            <>
              <span className="big-avatar" style={{ background: house?.color ?? '#eee' }}>
                {card.avatar}
              </span>
              <h3>{card.nickname}</h3>
              <p className="muted">House {card.house || '—'}</p>
            </>
          ) : (
            <>
              <h3>Make your Guild card!</h3>
              <p className="muted">Pick a nickname and your house.</p>
              <Link to="/me" className="btn primary wide">
                Create card
              </Link>
            </>
          )}
        </div>
        <div className="stat-row">
          <div className="stat">
            <span>✅</span>
            <b>{done.length}</b>
            <small>missions</small>
          </div>
          <div className="stat">
            <span>⚡</span>
            <b>{xp}</b>
            <small>XP to claim</small>
          </div>
          <div className="stat">
            <span>📚</span>
            <b>{missions.length}</b>
            <small>unlocked</small>
          </div>
        </div>
        {next && (
          <div className="card rail-card">
            <small className="eyebrow">NEXT MISSION</small>
            <h3>{next.title}</h3>
            <p className="muted">{next.mission}</p>
            <Link className="btn primary wide" to={`/m/${next.module}/l/${next.number}`}>
              Start mission
            </Link>
          </div>
        )}
        <p className="muted small">Your teacher keeps the official XP score. This page saves your checklists on this device only.</p>
      </aside>
    </div>
  );
}
