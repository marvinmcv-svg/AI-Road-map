import { MascotSays } from '../components/Mascot';
import { gamification } from '../lib/content';

export default function GamificationPage() {
  const g = gamification;
  return (
    <div className="narrow wide-ish">
      <h1>🏆 The AI Creators Guild</h1>
      <MascotSays>{g.story}</MascotSays>

      <h2>How students earn XP</h2>
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>XP</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {g.xpRules.map((r) => (
            <tr key={r.action}>
              <td>{r.action}</td>
              <td>
                <b>{r.xp}</b>
              </td>
              <td>{r.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Levels</h2>
      <div className="levels">
        {g.levels.map((l) => (
          <div key={l.level} className="level">
            <span className="level-num">{l.level}</span>
            <div>
              <b>{l.name}</b>
              <small>{l.xp} XP</small>
              <p>{l.perk}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Houses (teams)</h2>
      <div className="house-grid">
        {g.houses.map((h) => (
          <div key={h.name} className="house-card" style={{ background: h.color }}>
            <b>{h.name}</b>
            <small>“{h.motto}”</small>
          </div>
        ))}
      </div>

      <h2>Badges</h2>
      <div className="badges">
        {g.badges.map((b) => (
          <div key={b.id} className="badge">
            <span className={`medal ${b.secret ? "secret" : ""}`}>{b.icon}</span>
            <b>
              {b.name}
              {b.secret && <em> (secret)</em>}
            </b>
            <small>{b.how}</small>
          </div>
        ))}
      </div>

      <h2>Rituals that run all year</h2>
      <table>
        <thead>
          <tr>
            <th>Ritual</th>
            <th>When</th>
            <th>How</th>
            <th>Learning science</th>
          </tr>
        </thead>
        <tbody>
          {g.rituals.map((r) => (
            <tr key={r.name}>
              <td>
                <b>{r.name}</b>
              </td>
              <td>{r.when}</td>
              <td>{r.how}</td>
              <td>{r.principle}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>How each module plugs in</h2>
      <table>
        <thead>
          <tr>
            <th>Module</th>
            <th>Quest line</th>
            <th>Boss</th>
            <th>Badge</th>
          </tr>
        </thead>
        <tbody>
          {g.moduleHooks.map((h) => (
            <tr key={h.module}>
              <td>{h.module}</td>
              <td>{h.questLine}</td>
              <td>{h.boss}</td>
              <td>{h.badge}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Keeping it fair & motivating</h2>
      <ul>
        {g.fairness.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>
  );
}
