import { useState } from 'react';
import type { VocabTerm } from '../types';

export function FlipCard({ v, color }: { v: VocabTerm; color: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button className={`flip ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped((f) => !f)} style={{ '--c': color } as React.CSSProperties}>
      <div className="flip-inner">
        <div className="flip-front">
          <b>{v.term}</b>
          <small>tap to flip</small>
        </div>
        <div className="flip-back">
          <p>{v.definition}</p>
          <p>
            <span className="tag">🔗 Like</span> {v.analogy}
          </p>
          <p>
            <span className="tag">✨ e.g.</span> {v.example}
          </p>
        </div>
      </div>
    </button>
  );
}
