import { useState } from 'react';
import { modules } from '../content';
import { themeFor } from '../../lib/theme';
import { FlipCard } from '../../components/FlipCard';

export default function Words() {
  const [sel, setSel] = useState(modules[modules.length - 1]?.id ?? '');
  const m = modules.find((x) => x.id === sel);
  return (
    <div className="narrow wide-ish">
      <h1>🃏 Word cards</h1>
      <p className="muted">Tap a card to flip it. Quiz yourself: say the meaning BEFORE you flip!</p>
      <div className="tabs">
        {modules.map((x) => {
          const t = themeFor(x.number);
          return (
            <button
              key={x.id}
              className={`tab ${sel === x.id ? 'on' : ''}`}
              style={{ '--c': t.color, '--s': t.shade } as React.CSSProperties}
              onClick={() => setSel(x.id)}
            >
              {t.icon} {x.title}
            </button>
          );
        })}
      </div>
      {m && (
        <div className="flipgrid">
          {m.vocabulary.map((v) => (
            <FlipCard key={v.term} v={v} color={themeFor(m.number).color} />
          ))}
        </div>
      )}
    </div>
  );
}
