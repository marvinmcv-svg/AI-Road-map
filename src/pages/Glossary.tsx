import { useState } from 'react';
import { allVocab } from '../lib/content';

export default function Glossary() {
  const [q, setQ] = useState('');
  const terms = allVocab()
    .filter((v) => (v.term + v.definition + v.analogy).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div>
      <h1>📖 Glossary</h1>
      <p className="muted">Every vocabulary term from every written module. Use for Recall Raids and word walls.</p>
      <input className="search" placeholder="Search terms…" value={q} onChange={(e) => setQ(e.target.value)} />
      <table>
        <thead>
          <tr>
            <th>Term</th>
            <th>Definition</th>
            <th>Analogy</th>
            <th>Example</th>
            <th>Module</th>
          </tr>
        </thead>
        <tbody>
          {terms.map((v) => (
            <tr key={v.moduleId + v.term}>
              <td>
                <b>{v.term}</b>
              </td>
              <td>{v.definition}</td>
              <td>{v.analogy}</td>
              <td>{v.example}</td>
              <td>{v.moduleTitle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
