import { Link, useParams } from 'react-router-dom';
import { course, getModule, lessonsFor } from '../lib/content';
import { useProgress } from '../lib/progress';
import { AgeTag } from '../components/Bits';
import { RubricTable } from './Rubrics';

export default function ModulePage() {
  const { moduleId = '' } = useParams();
  const m = getModule(moduleId);
  const summary = course.modules.find((x) => x.id === moduleId);
  const { isTaught } = useProgress();

  if (!m) {
    return (
      <div>
        <h1>
          Module {summary?.number}: {summary?.title}
        </h1>
        <div className="callout">
          Full lesson plans for this module are written one module at a time. Planned:{' '}
          <b>{summary?.lessons} lessons</b>, weeks {summary?.weeks}. Boss / final project: {summary?.boss}.
        </div>
      </div>
    );
  }
  const ls = lessonsFor(m.id);

  return (
    <div>
      <p className="muted">
        Module {m.number} · weeks {m.weeks} · {ls.length} lessons × 90 min
      </p>
      <h1>{m.title}</h1>
      <p className="lead">{m.subtitle}</p>
      <div className="callout">
        <b>Big idea:</b> {m.bigIdea}
      </div>

      <nav className="toc no-print">
        <a href="#lessons">Lessons</a> · <a href="#objectives">Objectives</a> · <a href="#vocab">Vocabulary</a> ·{' '}
        <a href="#tools">Tools</a> · <a href="#game">Gamification</a> · <a href="#safety">Safety</a> ·{' '}
        <a href="#resources">Resources</a> · <a href="#project">Final project</a> · <a href="#diff">Differentiation</a>
      </nav>

      <h2 id="lessons">Lesson-by-lesson plan</h2>
      <ol className="lessonlist">
        {ls.map((l) => (
          <li key={l.id}>
            <Link to={`/m/${m.id}/l/${l.number}`}>
              <span className="lnum">L{l.number}</span>
              <span>
                <b>{l.title}</b>
                <small>{l.goal}</small>
              </span>
              <span className="lxp">
                {isTaught(l.id) ? '✅' : ''} +{l.xp} XP
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <h2 id="objectives">Learning objectives</h2>
      <p>Students will be able to…</p>
      <ul>
        {m.objectives.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>

      <h2 id="vocab">Key vocabulary & AI jargon</h2>
      <table>
        <thead>
          <tr>
            <th>Term</th>
            <th>Kid-friendly definition</th>
            <th>Real-life analogy</th>
            <th>Quick example</th>
          </tr>
        </thead>
        <tbody>
          {m.vocabulary.map((v) => (
            <tr key={v.term}>
              <td>
                <b>{v.term}</b>
              </td>
              <td>{v.definition}</td>
              <td>{v.analogy}</td>
              <td>{v.example}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="tools">Best AI tools for this module</h2>
      <p className="muted">Checked: {m.toolsVerified}. Free tiers and age rules change — re-check each term.</p>
      <table>
        <thead>
          <tr>
            <th>Tool</th>
            <th>Best for</th>
            <th>Free tier / limits</th>
            <th>Min. age (ToS)</th>
            <th>How we use it in class</th>
            <th>Beginner alternative</th>
          </tr>
        </thead>
        <tbody>
          {m.tools.map((t) => (
            <tr key={t.name}>
              <td>
                <b>{t.url ? <a href={t.url} target="_blank" rel="noreferrer">{t.name}</a> : t.name}</b>
              </td>
              <td>{t.bestFor}</td>
              <td>{t.freeTier}</td>
              <td>
                <AgeTag tag={t.ageTag} />
                <br />
                <small>{t.minAge}</small>
              </td>
              <td>{t.classroomUse}</td>
              <td>{t.alternative}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="game">How this module plugs into the game</h2>
      <ul>
        <li>
          <b>Quest line:</b> {m.gamification.questLine}
        </li>
        <li>
          <b>Module badge:</b> {m.gamification.badge}
        </li>
        <li>
          <b>Boss challenge:</b> {m.gamification.boss}
        </li>
      </ul>
      <h3>Side quests (fast finishers)</h3>
      <ul>
        {m.gamification.sideQuests.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>

      <h2 id="safety">Safety & ethics thread</h2>
      <table>
        <tbody>
          {m.safety.map((s) => (
            <tr key={s.topic}>
              <td>
                <b>{s.topic}</b>
              </td>
              <td>{s.teach}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="resources">YouTube & learning resources</h2>
      <p className="muted">
        Items marked “verify before class” are given as a channel + exact search phrase — preview before showing.
      </p>
      <table>
        <thead>
          <tr>
            <th>Channel / source</th>
            <th>What</th>
            <th>Why it fits</th>
            <th>Find it</th>
          </tr>
        </thead>
        <tbody>
          {m.resources.map((r) => (
            <tr key={r.title}>
              <td>{r.channel}</td>
              <td>{r.title}</td>
              <td>{r.why}</td>
              <td>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noreferrer">
                    Link
                  </a>
                )}
                {r.search && (
                  <>
                    Search: <code>{r.search}</code>
                  </>
                )}
                {r.verify && <span className="verify">verify before class</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="project">Final project: {m.finalProject.title}</h2>
      <p>{m.finalProject.brief}</p>
      <h3>Deliverables</h3>
      <ul>
        {m.finalProject.deliverables.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <h3>Rubric</h3>
      <RubricTable rubric={m.finalProject.rubric} />
      <div className="callout">
        <b>⚡ Level-up challenge:</b> {m.finalProject.levelUp}
      </div>

      <h2 id="diff">Differentiation</h2>
      <div className="grid2">
        <div className="card">
          <h3>🧩 Support for students who struggle</h3>
          <ul>
            {m.differentiation.support.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>🚀 Extensions for fast finishers</h3>
          <ul>
            {m.differentiation.extension.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </div>
      {m.carryForward && (
        <div className="callout">
          <b>Carries forward:</b> {m.carryForward}
        </div>
      )}
    </div>
  );
}
