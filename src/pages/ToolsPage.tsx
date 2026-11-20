import { useState } from 'react';
import { allTools } from '../lib/content';
import { AgeTag } from '../components/Bits';
import type { Tool } from '../types';

const FILTERS: { key: 'all' | Tool['ageTag']; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'all-ages-school', label: 'School account OK' },
  { key: '13+consent', label: '13+ with parent OK' },
  { key: '13+', label: '13+' },
  { key: '18+', label: '18+ (adults)' },
  { key: 'teacher-only', label: 'Teacher only' }
];

export default function ToolsPage() {
  const [f, setF] = useState<(typeof FILTERS)[number]['key']>('all');
  const tools = allTools().filter((t) => f === 'all' || t.ageTag === f);
  return (
    <div>
      <h1>🧰 AI tools & age rules</h1>
      <div className="callout warn">
        College and adult students (18+) can use every tool here on their own accounts. If you ever teach younger
        students: under-13s can't make accounts on 13+ tools and under-18s can't use 18+ tools, so you run the tool on
        your screen while they tell you what to type. Always follow your school's AI rules.
      </div>
      <div className="filters no-print">
        {FILTERS.map((x) => (
          <button key={x.key} className={f === x.key ? '' : 'ghost'} onClick={() => setF(x.key)}>
            {x.label}
          </button>
        ))}
      </div>
      <table>
        <thead>
          <tr>
            <th>Tool</th>
            <th>Best for</th>
            <th>Free tier</th>
            <th>Age</th>
            <th>Classroom use</th>
            <th>Alternative</th>
            <th>Modules</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((t) => (
            <tr key={t.name}>
              <td>
                <b>{t.name}</b>
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
              <td>{t.modules.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
