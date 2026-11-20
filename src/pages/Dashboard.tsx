import { Link } from 'react-router-dom';
import { course, lessons, lessonsFor } from '../lib/content';
import { useProgress } from '../lib/progress';
import { USING_DEFAULT_PASSWORD } from '../lib/auth';
import { themeFor, themeForId } from '../lib/theme';
import { LessonPath, LockedPath } from '../components/LessonPath';
import { MascotSays } from '../components/Mascot';
import { KEYS, useStored } from '../lib/storage';
import { EMPTY_TRACKER, houseStandings, type TrackerState } from '../lib/xp';

export default function Dashboard() {
  const { taught, isTaught } = useProgress();
  const [tracker] = useStored<TrackerState>(KEYS.tracker, EMPTY_TRACKER);
  const next = lessons.find((l) => !taught.includes(l.id));
  const done = taught.length;
  const pct = Math.round((done / course.schedule.planned) * 100);
  const houses = houseStandings(tracker);
  const today = new Date().toISOString().slice(0, 10);
  const awardedToday = tracker.log.some((e) => e.at.startsWith(today));
  const quests = [
    { label: 'Open the next lesson plan', done: false, to: next ? `/m/${next.module}/l/${next.number}` : '/' },
    { label: 'Award XP to a house today', done: awardedToday, to: '/tracker' },
    { label: 'Add your students to houses', done: tracker.students.length > 0, to: '/tracker' }
  ];

  return (
    <div className="with-rail">
      <section className="center-col">
        {USING_DEFAULT_PASSWORD && (
          <div className="callout warn">
            🔑 You're using the default password. Set your own before sharing the link (README → “Change the password”).
          </div>
        )}
        {done === 0 && (
          <Link to="/start" className="callout start-callout">
            👋 <b>New here?</b> Read <u>Start here</u> first: how the portal works, accounts to set up, and how to run a lesson in 7 steps.
          </Link>
        )}
        <MascotSays mood="happy">
          {next ? (
            <>
              Ready for <b>Lesson {next.courseNumber}</b>? <br />“{next.title}”
            </>
          ) : (
            <>Every written lesson is taught! Ask for the next module 🎉</>
          )}
        </MascotSays>

        {course.modules.map((m) => {
          const t = themeFor(m.number);
          const ls = lessonsFor(m.id);
          const t2 = ls.filter((l) => isTaught(l.id)).length;
          return (
            <div key={m.id} className="unit">
              <Link
                to={`/m/${m.id}`}
                className={`unit-banner ${m.status !== 'ready' ? 'is-locked' : ''}`}
                style={{ '--c': t.color, '--s': t.shade } as React.CSSProperties}
              >
                <div>
                  <small>
                    MODULE {m.number} · WEEKS {m.weeks}
                  </small>
                  <h2>{m.title}</h2>
                  <small className="unit-sub">
                    {m.status === 'ready' ? `${t2}/${ls.length} lessons taught` : `${m.lessons} lessons · plans coming next`}
                  </small>
                </div>
                <span className="unit-icon">{t.icon}</span>
              </Link>
              {m.status === 'ready' ? (
                <LessonPath lessons={ls} isTaught={isTaught} nextId={next?.id} />
              ) : (
                <LockedPath count={m.lessons} icon={t.icon} />
              )}
            </div>
          );
        })}
      </section>

      <aside className="rail">
        <div className="stat-row">
          <div className="stat">
            <span>🔥</span>
            <b>{done}</b>
            <small>taught</small>
          </div>
          <div className="stat">
            <span>📚</span>
            <b>{lessons.length}</b>
            <small>plans ready</small>
          </div>
          <div className="stat">
            <span>🎯</span>
            <b>{pct}%</b>
            <small>of year</small>
          </div>
        </div>

        {next && (
          <div className="card rail-card" style={{ borderColor: themeForId(next.module).color }}>
            <small className="eyebrow">NEXT UP</small>
            <h3>{next.title}</h3>
            <p className="muted">{next.goal}</p>
            <Link className="btn primary wide" to={`/m/${next.module}/l/${next.number}`}>
              Open lesson
            </Link>
          </div>
        )}

        <div className="card rail-card">
          <div className="rail-head">
            <h3>House race</h3>
            <Link to="/tracker">VIEW</Link>
          </div>
          {houses.map((h, i) => (
            <div key={h.name} className="house-row">
              <span className="rank">{['🥇', '🥈', '🥉', '4'][i]}</span>
              <span className="house-dot" style={{ background: h.color }} />
              <b>{h.name}</b>
              <div className="bar">
                <div style={{ width: `${houses[0].avg ? (h.avg / houses[0].avg) * 100 : 0}%`, background: h.color }} />
              </div>
              <small>{h.avg}</small>
            </div>
          ))}
          {!tracker.students.length && <p className="muted small">Add students in the tracker to start the race.</p>}
        </div>

        <div className="card rail-card">
          <h3>Teacher quests</h3>
          {quests.map((q) => (
            <Link key={q.label} to={q.to} className={`quest ${q.done ? 'done' : ''}`}>
              <span>{q.done ? '✅' : '⚡'}</span>
              {q.label}
            </Link>
          ))}
          <div className="xpbar">
            <div style={{ width: `${(quests.filter((q) => q.done).length / quests.length) * 100}%` }} />
            <span>
              {quests.filter((q) => q.done).length} / {quests.length}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
