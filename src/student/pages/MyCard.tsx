import { HOUSES, useDone, useGuildCard } from '../store';
import { MascotSays } from '../../components/Mascot';

const AVATARS = ['🤖', '🐼', '🦊', '🐉', '🦉', '🐙', '🌵', '🚀', '👾', '🦄', '🐸', '⚡'];

export default function MyCard() {
  const [card, setCard] = useGuildCard();
  const [done] = useDone();
  const house = HOUSES.find((h) => h.name === card.house);
  return (
    <div className="narrow">
      <h1>🪪 My Guild card</h1>
      <MascotSays mood="think">
        Use a <b>nickname</b>, not your real name. Your card stays on this device only.
      </MascotSays>
      <div className="guild-card" style={{ background: house?.color ?? '#7c5cff' }}>
        <span className="big-avatar">{card.avatar}</span>
        <div>
          <small>AI CREATORS GUILD</small>
          <h2>{card.nickname || 'Your nickname'}</h2>
          <p>
            House {card.house || '???'} · {done.length} missions complete
          </p>
        </div>
      </div>
      <div className="card">
        <label className="field">
          <b>Nickname</b>
          <input
            maxLength={20}
            placeholder="e.g. PixelPanda"
            value={card.nickname}
            onChange={(e) => setCard({ ...card, nickname: e.target.value })}
          />
        </label>
        <b>House</b>
        <div className="house-pick">
          {HOUSES.map((h) => (
            <button
              key={h.name}
              className={`house-btn ${card.house === h.name ? 'on' : ''}`}
              style={{ '--c': h.color } as React.CSSProperties}
              onClick={() => setCard({ ...card, house: h.name })}
            >
              <b>{h.name}</b>
              <small>{h.motto}</small>
            </button>
          ))}
        </div>
        <b>Avatar</b>
        <div className="avatar-pick">
          {AVATARS.map((a) => (
            <button key={a} className={`avatar-btn ${card.avatar === a ? 'on' : ''}`} onClick={() => setCard({ ...card, avatar: a })}>
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
