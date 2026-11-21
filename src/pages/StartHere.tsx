import { Link } from 'react-router-dom';
import { MascotSays } from '../components/Mascot';
import { FIRST_WEEK, LESSON_STEPS, PLAN_B, TECH_WORDS } from '../lib/teacherGuide';
import { STUDENT_SITE_URL } from '../lib/links';

export default function StartHere() {
  return (
    <div className="narrow wide-ish">
      <h1>👋 Start here</h1>
      <MascotSays mood="happy">
        New to teaching AI? Good news: you don't need to be a tech expert. Every lesson tells you <b>what to say</b>, <b>what to show</b> and <b>what to do if
        something breaks</b>. This page shows you how it all works in about 10 minutes.
      </MascotSays>

      <section className="card">
        <h2>🧭 The two websites</h2>
        <div className="grid2">
          <div>
            <h3>🔒 This Teacher Portal</h3>
            <p>Full lesson plans, scripts, timings, rubrics, XP tracker and your notes. Only for you. Password protected.</p>
          </div>
          <div>
            <h3>🎒 The Student site</h3>
            <p>
              Missions with checkboxes, step-by-step Tool guides, word cards, a Showcase and fun extras. No lesson plans inside.{' '}
              <a href={STUDENT_SITE_URL} target="_blank" rel="noreferrer">
                Open it ↗
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>🗓️ Your first week</h2>
        {FIRST_WEEK.map((b) => (
          <div key={b.title}>
            <h3>{b.title}</h3>
            <ul className="checklist">
              {b.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="card">
        <h2>🎬 How to run any lesson</h2>
        <ol className="ladder teach-steps">
          {LESSON_STEPS.map((s) => (
            <li key={s.title}>
              <span>{s.icon}</span>
              <div>
                <b>{s.title}</b>
                <small>{s.text}</small>
              </div>
            </li>
          ))}
        </ol>
        <Link className="btn primary" to="/">
          Go to my next lesson →
        </Link>
      </section>

      <section className="card">
        <h2>📖 Tech words in plain English</h2>
        <p className="muted small">The words that come up most. Every module also has full word cards in the Glossary.</p>
        <table>
          <tbody>
            {TECH_WORDS.map(([w, d]) => (
              <tr key={w}>
                <td>
                  <b>{w}</b>
                </td>
                <td>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>🛟 When the tech breaks</h2>
        <table className="planb">
          <tbody>
            {PLAN_B.map(([p, f]) => (
              <tr key={p}>
                <td>{p}</td>
                <td>{f}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="small">
          Every lesson also has a <b>🧭 Tool help & Plan B</b> box with fixes for the exact tools in that lesson.
        </p>
      </section>

      <section className="card">
        <h2>🔥 Keep them excited</h2>
        <p>
          Read the <Link to="/engage">Engagement playbook</Link>: 13 simple moves to keep your students coming back, and how to use the student site's streaks,
          side quests, sticker book and Showcase.
        </p>
      </section>
    </div>
  );
}
