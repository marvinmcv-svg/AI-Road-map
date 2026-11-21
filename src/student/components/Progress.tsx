import { useState } from 'react';
import { missions, modules } from '../content';
import { ALL_SIDE_QUESTS, bestStreak, rankFor, stickers, streak } from '../engage';
import { useActiveDays, useArcade, useDone, useShowcase, useSideQuests } from '../store';

// Arcade XP counts toward rank, up to this much (so missions stay the main path).
export const ARCADE_CAP = 500;

export function usePractice() {
  const [done] = useDone();
  const [days] = useActiveDays();
  const [showcase] = useShowcase();
  const [side] = useSideQuests();
  const [arcade] = useArcade();
  const xp = Math.min(arcade.points, ARCADE_CAP) + missions.filter((m) => done.includes(m.id)).reduce((s, m) => s + m.xp, 0) + side.length * 10;
  const st = streak(days);
  const best = bestStreak(days);
  const shows = Object.values(showcase).filter((s) => s.link || s.note).length;
  return {
    xp,
    rank: rankFor(xp),
    streak: st,
    best,
    stickers: stickers({ done, missions, modules, streak: st, bestStreak: best, showcase: shows, side: side.length, arcadeWins: arcade.wins, hangman: arcade.games.hangman ?? 0 })
  };
}

export function RankCard() {
  const { xp, rank, streak } = usePractice();
  return (
    <div className="card rail-card rank-card">
      <small className="eyebrow">YOUR RANK</small>
      <h3>
        Lv {rank.cur.level} · {rank.cur.name}
      </h3>
      <div className="banner-progress dark">
        <div style={{ width: `${rank.pct}%` }} />
      </div>
      <small className="muted">
        {rank.next ? `${rank.next.xp - xp} practice XP to ${rank.next.name}` : 'Top rank! 👑'}
      </small>
      <div className="streak-line">
        <span className={streak > 0 ? 'flame on' : 'flame'}>🔥</span>
        <b>{streak}</b> day{streak === 1 ? '' : 's'} in a row
      </div>
      {rank.next && <small className="muted">Next perk: {rank.next.perk}</small>}
    </div>
  );
}

export function SideQuestCard({ moduleId }: { moduleId?: string }) {
  const [side, setSide] = useSideQuests();
  const pool = ALL_SIDE_QUESTS.filter((q) => (!moduleId || q.module <= moduleId) && !side.includes(q.id));
  const [pick, setPick] = useState<(typeof pool)[number] | null>(null);
  const [spinning, setSpinning] = useState(false);
  const spin = () => {
    if (!pool.length) return;
    setSpinning(true);
    let n = 0;
    const iv = setInterval(() => {
      setPick(pool[Math.floor(Math.random() * pool.length)]);
      if (++n > 8) {
        clearInterval(iv);
        setSpinning(false);
      }
    }, 90);
  };
  return (
    <div className="card rail-card side-card">
      <small className="eyebrow">🎲 SIDE QUEST · 10 MIN · +10 XP</small>
      {pick ? <p className={spinning ? 'spinning' : ''}>{pick.text}</p> : <p className="muted">Got 10 minutes? Spin for a fun mini challenge!</p>}
      <div className="row">
        <button className="btn ghost small" onClick={spin} disabled={!pool.length}>
          {pick ? 'Spin again' : 'Spin'}
        </button>
        {pick && !spinning && (
          <button
            className="btn primary small"
            onClick={() => {
              setSide([...side, pick.id]);
              setPick(null);
            }}
          >
            I did it! ✔
          </button>
        )}
      </div>
      <small className="muted">{side.length} side quests done</small>
    </div>
  );
}
