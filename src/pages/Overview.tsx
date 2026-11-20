import { Link } from 'react-router-dom';
import { course, gamification } from '../lib/content';

export default function Overview() {
  const s = course.schedule;
  return (
    <div>
      <h1>{course.title}</h1>
      <p className="lead">{course.tagline}</p>
      <div className="chips">
        <span>{course.audience}</span>
        <span>{s.duration}</span>
        <span>{s.meetings}</span>
        <span>{s.lessonLength}</span>
        <span>
          {s.planned} planned + {s.buffer} buffer = {s.totalSlots} slots
        </span>
        <span>{course.budget}</span>
      </div>

      <h2>Module sequence</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Module</th>
            <th>Lessons</th>
            <th>Weeks</th>
            <th>Boss challenge / final project</th>
          </tr>
        </thead>
        <tbody>
          {course.modules.map((m) => (
            <tr key={m.id}>
              <td>{m.number}</td>
              <td>
                <Link to={`/m/${m.id}`}>{m.title}</Link>
              </td>
              <td>{m.lessons}</td>
              <td>{m.weeks}</td>
              <td>{m.boss}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Skills progression</h2>
      <table>
        <thead>
          <tr>
            <th>Stage</th>
            <th>Modules</th>
            <th>Students can…</th>
          </tr>
        </thead>
        <tbody>
          {course.progression.map((p) => (
            <tr key={p.stage}>
              <td>
                <b>{p.stage}</b>
              </td>
              <td>{p.modules}</td>
              <td>{p.studentsCan}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Every 90-minute lesson follows the same rhythm</h2>
      <table>
        <thead>
          <tr>
            <th>Segment</th>
            <th>Minutes</th>
            <th>Why</th>
          </tr>
        </thead>
        <tbody>
          {course.lessonTemplate.map((t) => (
            <tr key={t.segment}>
              <td>{t.segment}</td>
              <td>{t.minutes}</td>
              <td>{t.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Gamification at a glance</h2>
      <p>{gamification.story}</p>
      <p>
        <Link to="/gamification">Full system → levels, badges, houses, rituals</Link>
      </p>

      <h2>Safety & ethics threads (woven into every module)</h2>
      <ul>
        {course.safetyThreads.map((t) => (
          <li key={t.thread}>
            <b>{t.thread}:</b> {t.how}
          </li>
        ))}
      </ul>
      <h3>Age-rule tags used throughout</h3>
      <ul>
        {course.ageRuleKey.map((a) => (
          <li key={a.tag}>
            <b>{a.tag}</b> — {a.meaning}
          </li>
        ))}
      </ul>
    </div>
  );
}
