import { useEffect, useMemo, useState } from 'react';
import { isLetter, shuffle, type Word } from './words';

export interface GameProps {
  words: Word[];
  onWin: (points: number) => void;
}

const KEYS = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');

/* ---------------- Hangman: "Save Bolt" (each miss pops a balloon) ---------------- */
export function Hangman({ words, onWin }: GameProps) {
  const pool = useMemo(() => shuffle(words.filter((w) => w.answer.replace(/[^A-Z]/g, '').length >= 3)), [words]);
  const [i, setI] = useState(0);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [hint, setHint] = useState(false);
  const w = pool[i % Math.max(pool.length, 1)];
  const MAX = 6;
  const misses = w ? guessed.filter((g) => !w.answer.includes(g)).length : 0;
  const won = !!w && [...w.answer].every((c) => !isLetter(c) || guessed.includes(c));
  const lost = misses >= MAX;

  const guess = (c: string) => {
    if (won || lost || guessed.includes(c)) return;
    const next = [...guessed, c];
    setGuessed(next);
    if (w && [...w.answer].every((x) => !isLetter(x) || next.includes(x))) onWin(hint ? 5 : 10);
  };
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const c = e.key.toUpperCase();
      if (/^[A-Z]$/.test(c)) guess(c);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });
  if (!w) return <p>No words yet.</p>;
  const nextWord = () => {
    setI(i + 1);
    setGuessed([]);
    setHint(false);
  };

  return (
    <div className="game hangman">
      <svg viewBox="0 0 200 170" className="bolt-balloons" aria-label={`${MAX - misses} balloons left`}>
        {Array.from({ length: MAX }).map((_, b) => {
          const x = 40 + b * 24;
          const popped = b < misses;
          return (
            <g key={b} className={popped ? 'popped' : ''}>
              <line x1={x} y1={50} x2={100} y2={110} stroke="#bbb" strokeWidth="1.2" />
              <ellipse cx={x} cy={30 + (b % 2) * 12} rx="13" ry="16" fill={['#ff5fa2', '#ffc800', '#1cb0f6', '#14c38e', '#7c5cff', '#ff8a2a'][b]} />
            </g>
          );
        })}
        <g className={lost ? 'bolt-fall' : won ? 'bolt-happy' : ''}>
          <rect x="82" y="108" width="36" height="34" rx="10" fill="#2dd4bf" />
          <circle cx="100" cy="122" r="8" fill="#fff" />
          <circle cx="100" cy="122" r="4" fill="#fbbf24" />
          <path d={lost ? 'M92 136 q8 -6 16 0' : 'M92 133 q8 6 16 0'} stroke="#1e1b4b" strokeWidth="2.5" fill="none" />
          <rect x="88" y="142" width="8" height="10" rx="3" fill="#0d9488" />
          <rect x="104" y="142" width="8" height="10" rx="3" fill="#0d9488" />
        </g>
      </svg>
      <p className="game-status">{won ? '🎉 You saved Bolt!' : lost ? '💥 Oh no! All the balloons popped.' : `🎈 ${MAX - misses} balloons left`}</p>
      <div className="hang-word" aria-live="polite">
        {[...w.answer].map((c, k) =>
          isLetter(c) ? (
            <span key={k} className={`slot ${guessed.includes(c) || lost ? 'show' : ''} ${lost && !guessed.includes(c) ? 'missed' : ''}`}>
              {guessed.includes(c) || lost ? c : ''}
            </span>
          ) : c === ' ' ? (
            <span key={k} className="gap" />
          ) : (
            <span key={k} className="punct">
              {c}
            </span>
          )
        )}
      </div>
      <div className="clue-box">
        <b>Clue:</b> {w.clue}
        {hint && w.extra && <div className="muted">💭 Like: {w.extra}</div>}
      </div>
      <div className="keyboard">
        {KEYS.map((c) => (
          <button key={c} disabled={guessed.includes(c) || won || lost} className={guessed.includes(c) ? (w.answer.includes(c) ? 'hit' : 'miss') : ''} onClick={() => guess(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="row center">
        {!hint && !won && !lost && w.extra && (
          <button className="btn ghost small" onClick={() => setHint(true)}>
            💡 Extra hint (half points)
          </button>
        )}
        {(won || lost) && (
          <button className="btn primary" onClick={nextWord}>
            Next word →
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Memory Match: word ↔ meaning ---------------- */
interface Card {
  id: string;
  pair: number;
  text: string;
  kind: 'word' | 'meaning';
}
export function MemoryMatch({ words, onWin }: GameProps) {
  const [round, setRound] = useState(0);
  const cards = useMemo<Card[]>(() => {
    const pick = shuffle(words).slice(0, 6);
    return shuffle(
      pick.flatMap((w, p) => [
        { id: `w${p}`, pair: p, text: w.shown, kind: 'word' as const },
        { id: `m${p}`, pair: p, text: w.clue, kind: 'meaning' as const }
      ])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, round]);
  const [open, setOpen] = useState<string[]>([]);
  const [found, setFound] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const done = cards.length > 0 && found.length === cards.length / 2;

  const flip = (c: Card) => {
    if (open.length === 2 || open.includes(c.id) || found.includes(c.pair)) return;
    const next = [...open, c.id];
    setOpen(next);
    if (next.length === 2) {
      setMoves(moves + 1);
      const [a, b] = next.map((id) => cards.find((x) => x.id === id)!);
      if (a.pair === b.pair) {
        const f = [...found, a.pair];
        setFound(f);
        setOpen([]);
        if (f.length === cards.length / 2) onWin(moves + 1 <= 9 ? 15 : 10);
      } else setTimeout(() => setOpen([]), 1100);
    }
  };
  return (
    <div className="game">
      <p className="game-status">{done ? `🎉 All pairs found in ${moves} moves!` : `Find each word and its meaning. Moves: ${moves}`}</p>
      <div className="match-grid">
        {cards.map((c) => {
          const up = open.includes(c.id) || found.includes(c.pair);
          return (
            <button key={c.id} className={`match-card ${up ? 'up' : ''} ${found.includes(c.pair) ? 'found' : ''} ${c.kind}`} onClick={() => flip(c)}>
              {up ? c.text : '❓'}
            </button>
          );
        })}
      </div>
      {done && (
        <div className="row center">
          <button
            className="btn primary"
            onClick={() => {
              setRound(round + 1);
              setFound([]);
              setOpen([]);
              setMoves(0);
            }}
          >
            Play again →
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Quiz Blitz: 60 seconds, pick the right word ---------------- */
export function QuizBlitz({ words, onWin }: GameProps) {
  const [state, setState] = useState<'ready' | 'play' | 'over'>('ready');
  const [time, setTime] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [q, setQ] = useState<{ w: Word; options: string[] } | null>(null);
  const [flash, setFlash] = useState<'' | 'right' | 'wrong'>('');
  const [best, setBest] = useState(() => Number(localStorage.getItem('arcade.blitz.best') || 0));

  const newQ = () => {
    const w = shuffle(words)[0];
    const others = shuffle(words.filter((x) => x.shown !== w.shown)).slice(0, 3).map((x) => x.shown);
    setQ({ w, options: shuffle([w.shown, ...others]) });
  };
  useEffect(() => {
    if (state !== 'play') return;
    if (time <= 0) {
      setState('over');
      if (score > best) {
        localStorage.setItem('arcade.blitz.best', String(score));
        setBest(score);
      }
      if (score >= 5) onWin(Math.min(25, score * 2));
      return;
    }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  });
  const answer = (o: string) => {
    if (!q) return;
    if (o === q.w.shown) {
      setScore(score + 1 + (streak >= 2 ? 1 : 0));
      setStreak(streak + 1);
      setFlash('right');
    } else {
      setStreak(0);
      setFlash('wrong');
    }
    setTimeout(() => setFlash(''), 300);
    newQ();
  };
  if (state === 'ready' || state === 'over')
    return (
      <div className="game center-text">
        {state === 'over' ? (
          <>
            <h3>⏱️ Time's up!</h3>
            <p className="big-score">{score} points</p>
            <p className="muted">Best: {best}. {score >= 5 ? 'Great run!' : 'Get 5+ points to earn XP.'}</p>
          </>
        ) : (
          <>
            <h3>⚡ 60 seconds. How many can you get?</h3>
            <p className="muted">Read the meaning, tap the right word. 3 in a row = bonus points!</p>
          </>
        )}
        <button
          className="btn primary"
          onClick={() => {
            setScore(0);
            setStreak(0);
            setTime(60);
            newQ();
            setState('play');
          }}
        >
          {state === 'over' ? 'Play again' : 'Start!'}
        </button>
      </div>
    );
  return (
    <div className={`game blitz ${flash}`}>
      <div className="blitz-top">
        <span>⏱️ {time}s</span>
        <span>⭐ {score}</span>
        <span>{streak >= 2 ? `🔥 x${streak}` : ''}</span>
      </div>
      <div className="blitz-bar">
        <div style={{ width: `${(time / 60) * 100}%` }} />
      </div>
      <div className="clue-box big">{q?.w.clue}</div>
      <div className="blitz-options">
        {q?.options.map((o) => (
          <button key={o} className="btn chip" onClick={() => answer(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Word Scramble: tap letters in the right order ---------------- */
export function Scramble({ words, onWin }: GameProps) {
  const pool = useMemo(() => shuffle(words.filter((w) => /^[A-Z]{3,12}$/.test(w.answer))), [words]);
  const [i, setI] = useState(0);
  const w = pool[i % Math.max(pool.length, 1)];
  const tiles = useMemo(() => {
    if (!w) return [];
    let s = shuffle([...w.answer]);
    for (let n = 0; n < 5 && s.join('') === w.answer; n++) s = shuffle(s);
    return s.map((c, k) => ({ c, k }));
  }, [w]);
  const [picked, setPicked] = useState<number[]>([]);
  const built = picked.map((k) => tiles[k].c).join('');
  const won = !!w && built === w.answer;
  const full = !!w && built.length === w.answer.length;
  useEffect(() => {
    if (won) onWin(10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);
  if (!w) return <p>No words yet.</p>;
  return (
    <div className="game">
      <div className="clue-box">
        <b>Clue:</b> {w.clue}
      </div>
      <div className="hang-word">
        {[...w.answer].map((_, k) => (
          <span key={k} className={`slot show ${full && !won ? 'missed' : ''}`}>
            {built[k] ?? ''}
          </span>
        ))}
      </div>
      <div className="keyboard tiles">
        {tiles.map((t) => (
          <button key={t.k} disabled={picked.includes(t.k) || won} onClick={() => setPicked([...picked, t.k])}>
            {t.c}
          </button>
        ))}
      </div>
      <p className="game-status">{won ? '🎉 You got it!' : full ? '🤔 Not quite. Tap Undo and try again.' : ' '}</p>
      <div className="row center">
        <button className="btn ghost small" onClick={() => setPicked(picked.slice(0, -1))} disabled={!picked.length || won}>
          ↩ Undo
        </button>
        <button className="btn ghost small" onClick={() => setPicked([])} disabled={!picked.length || won}>
          Clear
        </button>
        <button
          className={`btn ${won ? 'primary' : 'ghost'} small`}
          onClick={() => {
            setI(i + 1);
            setPicked([]);
          }}
        >
          {won ? 'Next word →' : 'Skip'}
        </button>
      </div>
    </div>
  );
}

export const GAMES = [
  { id: 'hangman', name: 'Save Bolt (Hangman)', icon: '🎈', blurb: 'Guess the word letter by letter before all the balloons pop.', C: Hangman },
  { id: 'match', name: 'Memory Match', icon: '🃏', blurb: 'Flip cards to match each word with its meaning.', C: MemoryMatch },
  { id: 'blitz', name: 'Quiz Blitz', icon: '⚡', blurb: '60 seconds. Read the meaning, tap the word. Build a streak!', C: QuizBlitz },
  { id: 'scramble', name: 'Word Scramble', icon: '🔀', blurb: 'Tap the mixed-up letters in the right order.', C: Scramble }
];
