import { useMemo, useState } from 'react';
import { GAMES } from './Games';
import { QUESTS, wordsFor } from './words';

const ICONS: Record<number, string> = { 0: '🚀', 1: '🎨', 2: '🎬', 3: '🌐', 4: '⚙️', 5: '📱', 6: '🕹️' };

export function ArcadePage({
  title,
  intro,
  defaultQuest,
  onWin,
  footer
}: {
  title: string;
  intro: React.ReactNode;
  defaultQuest?: string;
  onWin?: (points: number, game: string) => void;
  footer?: React.ReactNode;
}) {
  const [quests, setQuests] = useState<string[]>([defaultQuest ?? QUESTS[0]?.id].filter(Boolean) as string[]);
  const [game, setGame] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const words = useMemo(() => wordsFor(quests), [quests]);
  const G = GAMES.find((g) => g.id === game);

  const win = (p: number) => {
    onWin?.(p, game ?? '');
    setToast(onWin ? `+${p} arcade XP!` : 'Nice!');
    setTimeout(() => setToast(''), 1800);
  };

  return (
    <div className="narrow wide-ish arcade">
      <h1>{title}</h1>
      {intro}

      <div className="card">
        <small className="eyebrow">1 · PICK THE WORDS (from which quests?)</small>
        <div className="tool-chips">
          {QUESTS.map((q) => (
            <button
              key={q.id}
              className={`quest-chip ${quests.includes(q.id) ? 'on' : ''}`}
              onClick={() => setQuests(quests.includes(q.id) ? (quests.length > 1 ? quests.filter((x) => x !== q.id) : quests) : [...quests, q.id])}
            >
              {ICONS[q.number] ?? '⭐'} {q.title}
            </button>
          ))}
          <button className="quest-chip" onClick={() => setQuests(QUESTS.map((q) => q.id))}>
            🌈 All
          </button>
        </div>
        <small className="muted">{words.length} words in the mix</small>
      </div>

      <small className="eyebrow">2 · PICK A GAME</small>
      <div className="game-picker">
        {GAMES.map((g) => (
          <button key={g.id} className={`game-tile ${game === g.id ? 'on' : ''}`} onClick={() => setGame(g.id)}>
            <span>{g.icon}</span>
            <b>{g.name}</b>
            <small>{g.blurb}</small>
          </button>
        ))}
      </div>

      {G && (
        <section className="card game-card" key={`${G.id}-${quests.join()}`}>
          <h2>
            {G.icon} {G.name}
          </h2>
          <G.C words={words} onWin={win} />
        </section>
      )}
      {toast && <div className="toast">{toast}</div>}
      {footer}
    </div>
  );
}
