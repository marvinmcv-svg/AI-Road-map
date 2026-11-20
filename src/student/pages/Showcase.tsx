import { Link } from 'react-router-dom';
import { missions, modules } from '../content';
import { themeFor } from '../../lib/theme';
import { MascotSays } from '../../components/Mascot';
import { useShowcase } from '../store';

export default function Showcase() {
  const [showcase] = useShowcase();
  const items = missions.filter((m) => showcase[m.id]?.link || showcase[m.id]?.note);
  return (
    <div className="narrow wide-ish">
      <h1>🖼️ My Showcase</h1>
      <MascotSays mood="happy">
        Everything you've made, in one place. It's your portfolio for <b>Demo Day</b>, a job or a class application. Add to it at the end of each mission!
      </MascotSays>
      {items.length === 0 ? (
        <div className="card">
          <p>Nothing here yet. Finish a mission, then fill in <b>"Save what you made"</b> at the bottom of the page.</p>
          <Link className="btn primary" to="/">
            Go to my next mission
          </Link>
        </div>
      ) : (
        <div className="showcase-grid">
          {items.map((m) => {
            const s = showcase[m.id];
            const mod = modules.find((x) => x.id === m.module);
            const t = themeFor(mod?.number ?? 0);
            return (
              <div key={m.id} className="show-tile" style={{ '--c': t.color } as React.CSSProperties}>
                <small>
                  {t.icon} {mod?.title} · Mission {m.number} {s.feel ?? ''}
                </small>
                <b>{m.title}</b>
                {s.note && <p>{s.note}</p>}
                <div className="row">
                  {s.link && (
                    <a className="btn primary small" href={s.link} target="_blank" rel="noreferrer">
                      Open ↗
                    </a>
                  )}
                  <Link className="btn ghost small" to={`/m/${m.module}/l/${m.number}`}>
                    Edit
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p className="muted small">Saved on this device only. To keep a copy, take a screenshot or paste your links into a doc.</p>
    </div>
  );
}
