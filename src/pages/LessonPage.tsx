import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getModule, lessons } from '../lib/content';
import { useProgress } from '../lib/progress';
import { KEYS, useStored } from '../lib/storage';
import { Markdown } from '../components/Markdown';
import { SegmentBar } from '../components/Bits';

export default function LessonPage() {
  const { moduleId = '', n = '1' } = useParams();
  const idx = lessons.findIndex((l) => l.module === moduleId && l.number === Number(n));
  const lesson = lessons[idx];
  const m = getModule(moduleId);
  const { isTaught, toggle } = useProgress();
  const [notes, setNotes] = useStored<Record<string, string>>(KEYS.notes, {});
  const [present, setPresent] = useState(false);

  if (!lesson || !m) return <p>Lesson not found.</p>;
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];

  return (
    <div className={present ? 'present' : ''}>
      <div className="lessonhead">
        <p className="muted">
          <Link to={`/m/${m.id}`}>
            Module {m.number}: {m.title}
          </Link>{' '}
          · Lesson {lesson.number} · Course lesson {lesson.courseNumber}/70 · 90 min · +{lesson.xp} XP available
        </p>
        <h1>{lesson.title}</h1>
        <p className="lead">{lesson.goal}</p>
        <div className="actions no-print">
          <button onClick={() => toggle(lesson.id)}>{isTaught(lesson.id) ? '✅ Taught' : 'Mark as taught'}</button>
          <button className="ghost" onClick={() => window.print()}>
            🖨️ Print / PDF
          </button>
          <button className="ghost" onClick={() => setPresent((p) => !p)}>
            {present ? 'Exit present mode' : '📽️ Present mode'}
          </button>
        </div>
      </div>

      <SegmentBar segments={lesson.segments} />

      <div className="grid2">
        <div className="card">
          <h3>🧰 Tools</h3>
          <ul>
            {lesson.tools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>📋 Prep before class</h3>
          <ul>
            {lesson.prep.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <details className="card principles">
        <summary>🧠 Learning-science principle per segment</summary>
        <table>
          <tbody>
            {lesson.segments.map((s) => (
              <tr key={s.name}>
                <td>
                  <b>{s.name}</b> ({s.minutes}′)
                </td>
                <td>{s.principle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <Markdown source={lesson.body} />

      <div className="card no-print">
        <h3>📝 My private notes for this lesson</h3>
        <textarea
          rows={5}
          placeholder="What worked, what to change next year, which students need follow-up…"
          value={notes[lesson.id] || ''}
          onChange={(e) => setNotes({ ...notes, [lesson.id]: e.target.value })}
        />
        <small className="muted">Saved on this device only.</small>
      </div>

      <div className="pager no-print">
        {prev ? <Link to={`/m/${prev.module}/l/${prev.number}`}>← {prev.title}</Link> : <span />}
        {next ? <Link to={`/m/${next.module}/l/${next.number}`}>{next.title} →</Link> : <span />}
      </div>
    </div>
  );
}
