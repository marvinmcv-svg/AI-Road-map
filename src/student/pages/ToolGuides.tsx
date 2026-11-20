import { Link, useParams } from 'react-router-dom';
import { GUIDES, guideById } from '../toolGuides';
import { MascotSays } from '../../components/Mascot';
import { CopyBox } from '../components/CopyBox';

export function ToolGuideList() {
  return (
    <div className="narrow wide-ish">
      <h1>🧭 Tool guides</h1>
      <MascotSays mood="happy">
        New to a tool? Start here! Each guide shows <b>what it is</b>, <b>how to set it up</b> step by step, a <b>first thing to try</b>, and{' '}
        <b>fixes for when you get stuck</b>.
      </MascotSays>
      <div className="guide-grid">
        {GUIDES.map((g) => (
          <Link key={g.id} to={`/tools/${g.id}`} className="guide-tile" style={{ '--c': g.color } as React.CSSProperties}>
            <span className="guide-icon">{g.icon}</span>
            <b>{g.name}</b>
            <small>{g.oneLiner}</small>
            <span className="guide-used">{g.usedIn}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ToolGuidePage() {
  const { id = '' } = useParams();
  const g = guideById(id);
  if (!g) return <p>Guide not found.</p>;
  return (
    <div className="narrow wide-ish guide-page">
      <div className="crumbs">
        <Link to="/tools">🧭 Tool guides</Link>
        <span>{g.name}</span>
      </div>
      <div className="guide-hero" style={{ '--c': g.color } as React.CSSProperties}>
        <span className="guide-icon big">{g.icon}</span>
        <div>
          <h1>{g.name}</h1>
          <p>{g.oneLiner}</p>
          <p className="guide-like">💭 Think of it like: {g.likeA}</p>
        </div>
      </div>

      <div className="guide-facts">
        <div>
          <small>USED IN</small>
          <b>{g.usedIn}</b>
        </div>
        <div>
          <small>COST</small>
          <b>{g.cost}</b>
        </div>
        <div>
          <small>ACCOUNT</small>
          <b>{g.account}</b>
        </div>
      </div>
      {g.url && (
        <a className="btn primary" href={g.url} target="_blank" rel="noreferrer">
          Open {g.name.split(' (')[0]} ↗
        </a>
      )}

      <section className="card">
        <h2>🪜 Set it up, step by step</h2>
        <ol className="guide-steps">
          {g.setup.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="muted small">Buttons in apps move around a lot. Can't find one? Look in the ☰ or ⚙️ menu, or ask the AI "Where is ___ in {g.name.split(' (')[0]}?"</p>
      </section>

      {g.firstTry && (
        <section className="card">
          <h2>✨ First thing to try</h2>
          <CopyBox label={g.firstTry.label} text={g.firstTry.prompt} />
        </section>
      )}

      <section className="card">
        <h2>💡 Pro tips</h2>
        <ul>
          {g.tips.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="card stuck-card">
        <h2>🆘 Stuck? Try this</h2>
        {g.stuck.map(([p, f]) => (
          <details key={p}>
            <summary>{p}</summary>
            <p>{f}</p>
          </details>
        ))}
      </section>

      {g.safety.length > 0 && (
        <section className="card safety-card">
          <h2>🛡️ Stay safe</h2>
          <ul>
            {g.safety.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
