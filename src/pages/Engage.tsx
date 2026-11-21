import { MascotSays } from '../components/Mascot';
import { PLAYBOOK } from '../lib/teacherGuide';
import { STUDENT_SITE_URL } from '../lib/links';

const STUDENT_FEATURES: [string, string, string][] = [
  ['🏅', 'Rank & sticker book', 'Students level up from Prompt Rookie to AI Architect as they finish missions, and collect stickers (first mission, streaks, quests cleared).'],
  ['🔥', 'Streaks', 'Counts days in a row with at least one ticked step. Ask about it at the start of class.'],
  ['🕹️', 'Word Arcade', 'Hangman (Save Bolt), Memory Match, Quiz Blitz and Word Scramble with each quest\'s words. Wins give arcade XP (up to 500 counts toward rank).'],
  ['🎲', 'Side-quest spinner', '35 ten-minute mini challenges, only from quests they have reached. Great for early finishers. +10 XP each.'],
  ['🖼️', 'My Showcase', 'A portfolio of everything they made, with links and a "proud of" note. Use it on Demo Day.'],
  ['😵', 'Feel check', 'Each mission ends with 😎 🙂 🤔 😵. A quick way to spot who is lost.'],
  ['🧭', 'Tool guides', 'Step-by-step help for 18 tools, with "Stuck?" fixes. Students can solve most problems alone.'],
  ['📖', 'Tap-to-explain words', 'Tech words in missions are underlined. Tap one to see what it means.']
];

export default function Engage() {
  return (
    <div className="narrow wide-ish">
      <h1>🔥 Engagement playbook</h1>
      <MascotSays mood="happy">
        Students stay when they feel <b>able</b>, <b>in charge</b> and <b>seen</b>. These 13 moves do that. Pick 2 or 3 to try this week.
      </MascotSays>

      <div className="play-grid">
        {PLAYBOOK.map((p) => (
          <div key={p.title} className="card play">
            <h3>
              {p.icon} {p.title}
            </h3>
            <p className="muted small">Why: {p.why}</p>
            <ul>
              {p.how.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <section className="card">
        <h2>🎒 What your students get on their site</h2>
        <table>
          <tbody>
            {STUDENT_FEATURES.map(([i, t, d]) => (
              <tr key={t}>
                <td>
                  {i} <b>{t}</b>
                </td>
                <td>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="small">
          Their rank uses "practice XP" from the missions they tick. <b>You still keep the official XP</b> in the XP tracker. If the two differ, yours wins.{' '}
          <a href={STUDENT_SITE_URL} target="_blank" rel="noreferrer">
            Open the student site ↗
          </a>
        </p>
      </section>
    </div>
  );
}
