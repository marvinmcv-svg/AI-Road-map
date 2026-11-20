import { TOOLKIT } from '../toolkit';

export default function Toolkit() {
  return (
    <div className="narrow wide-ish">
      <h1>🧰 Creator toolkit</h1>
      <p className="muted">Your cheat sheets. Use them every time you prompt!</p>
      <div className="toolkit-grid">
        {TOOLKIT.map((k) => (
          <div key={k.title} className="kit" style={{ '--c': k.color, '--s': k.shade } as React.CSSProperties}>
            <div className="kit-head">
              <span>{k.icon}</span>
              <h2>{k.title}</h2>
            </div>
            {k.rows.map(([a, b]) => (
              <div key={a} className="kit-row">
                <b>{a}</b>
                <span>{b}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
