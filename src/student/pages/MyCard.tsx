import { HOUSES, useDone, useGuildCard, useLearnMode } from '../store';
import { MascotSays } from '../../components/Mascot';
import { RankCard, usePractice } from '../components/Progress';

const AVATARS = ['🤖', '🐼', '🦊', '🐉', '🦉', '🐙', '🌵', '🚀', '👾', '🦄', '🐸', '⚡'];

export default function MyCard() {
  const [card, setCard] = useGuildCard();
  const [done] = useDone();
  const [mode, setMode] = useLearnMode();
  const house = HOUSES.find((h) => h.name === card.house);
  const { stickers } = usePractice();
  const got = stickers.filter((s) => s.got).length;
  return (
    <div className="narrow">
      <h1>🪪 My Guild card</h1>
      <MascotSays mood="think">
        Use a <b>nickname</b>, not your real name. Your card stays on this device only. No one else can see it.
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
      <RankCard />
      <div className="card">
        <h2>
          🏅 Sticker book <small className="muted">{got}/{stickers.length}</small>
        </h2>
        <div className="sticker-grid">
          {stickers.map((s) => (
            <div key={s.id} className={`sticker ${s.got ? 'got' : ''}`} title={s.how}>
              <span>{s.got ? s.icon : '🔒'}</span>
              <b>{s.name}</b>
              <small>{s.how}</small>
            </div>
          ))}
        </div>
        <p className="muted small">Your teacher also gives Boss badges and secret badges (like 🐞 Bug Hunter and 🤝 Guild Mentor). Ask what they are!</p>
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
        <b>How do you learn?</b>
        <div className="mode-switch" role="group" aria-label="How do you learn?">
          <button className={mode === 'solo' ? 'on' : ''} onClick={() => setMode('solo')}>
            👤 Just me and my teacher
          </button>
          <button className={mode === 'group' ? 'on' : ''} onClick={() => setMode('group')}>
            👥 With a group
          </button>
        </div>
        <b>House (your team color)</b>
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
