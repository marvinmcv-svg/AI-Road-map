import { modules } from '../lib/content';
import type { RubricCriterion } from '../types';

export function RubricTable({ rubric }: { rubric: RubricCriterion[] }) {
  return (
    <table className="rubric">
      <thead>
        <tr>
          <th>Criterion</th>
          <th>1 · Beginning</th>
          <th>2 · Developing</th>
          <th>3 · Proficient</th>
          <th>4 · Pro</th>
        </tr>
      </thead>
      <tbody>
        {rubric.map((r) => (
          <tr key={r.criterion}>
            <td>
              <b>{r.criterion}</b>
            </td>
            {r.levels.map((l, i) => (
              <td key={i}>{l}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Rubrics() {
  return (
    <div>
      <h1>✅ Final-project rubrics</h1>
      <p className="muted">Print this page for grading. Score each criterion 1–4; XP = score × 25.</p>
      {modules.map((m) => (
        <section key={m.id} className="rubric-section">
          <h2>
            Module {m.number}: {m.finalProject.title}
          </h2>
          <p>{m.finalProject.brief}</p>
          <RubricTable rubric={m.finalProject.rubric} />
          <p>
            <b>⚡ Level-up:</b> {m.finalProject.levelUp}
          </p>
        </section>
      ))}
    </div>
  );
}
