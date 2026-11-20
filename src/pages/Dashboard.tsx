import { Link } from 'react-router-dom';
import { course, lessons, lessonsFor } from '../lib/content';
import { useProgress } from '../lib/progress';
import { USING_DEFAULT_PASSWORD } from '../lib/auth';

export default function Dashboard() {
  const { taught } = useProgress();
  const next = lessons.find((l) => !taught.includes(l.id));
  const done = taught.length;
  return (
    <div>
      <h1>Welcome back 👋</h1>
      {USING_DEFAULT_PASSWORD && (
        <div className="callout warn">
          You're using the default portal password. Set your own before sharing the link — see README → “Change the
          password”.
        </div>
      )}
      <div className="grid2">
        <div className="card">
          <h3>Next up</h3>
          {next ? (
            <>
              <p className="muted">
                Lesson {next.courseNumber} of {course.schedule.planned} · Module {Number(next.module.slice(0, 2))}: {course.modules.find((m) => m.id === next.module)?.title}
              </p>
              <h2>{next.title}</h2>
              <p>{next.goal}</p>
              <Link className="button" to={`/m/${next.module}/l/${next.number}`}>
                Open lesson plan →
              </Link>
            </>
          ) : (
            <p>All written lessons are marked taught. 🎉 Ask for the next module!</p>
          )}
        </div>
        <div className="card">
          <h3>Year progress</h3>
          <div className="bigstat">
            {done}
            <small> / {course.schedule.planned} lessons taught</small>
          </div>
          <div className="progress">
            <div style={{ width: `${(done / course.schedule.planned) * 100}%` }} />
          </div>
          <p className="muted">{lessons.length} lesson plans written so far.</p>
        </div>
      </div>
      <h2>Modules</h2>
      <div className="modgrid">
        {course.modules.map((m) => {
          const ls = lessonsFor(m.id);
          const t = ls.filter((l) => taught.includes(l.id)).length;
          return (
            <Link key={m.id} to={`/m/${m.id}`} className={`modcard ${m.status}`}>
              <span className="modnum">{m.number}</span>
              <b>{m.title}</b>
              <small>
                {m.lessons} lessons · weeks {m.weeks}
              </small>
              <small>{m.status === 'ready' ? `${t}/${ls.length} taught` : 'Plans coming next'}</small>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
