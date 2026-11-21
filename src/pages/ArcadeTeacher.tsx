import { ArcadePage } from '../arcade/ArcadePage';
import { MascotSays } from '../components/Mascot';
import { lessons } from '../lib/content';
import { useProgress } from '../lib/progress';

export default function ArcadeTeacher() {
  const { taught } = useProgress();
  const next = lessons.find((l) => !taught.includes(l.id));
  return (
    <ArcadePage
      title="🕹️ Word Arcade (class mode)"
      defaultQuest={next?.module}
      intro={
        <>
          <MascotSays mood="happy">
            Use these games for <b>warm-ups</b>, <b>Recall Raids</b> and <b>Boss Week</b> word reviews. Put this page on the big screen (or share your screen)
            and play together.
          </MascotSays>
          <div className="grid2">
            <div className="card">
              <h3>👤 1-on-1: how to play</h3>
              <ol>
                <li>Pick the quest you're on.</li>
                <li>Student plays. You read the clue out loud.</li>
                <li>Swap: you play, they give the clues in their own words (that is real learning!).</li>
                <li>+10 XP for playing in the tracker. Winning is a bonus.</li>
              </ol>
            </div>
            <div className="card">
              <h3>👥 Group: how to play</h3>
              <ol>
                <li>Put the game on the big screen.</li>
                <li>Houses take turns calling a letter or an answer.</li>
                <li>Right answer = +5 to that house. Keep it fast!</li>
                <li>Students can also play alone on the student site (Word Arcade).</li>
              </ol>
            </div>
          </div>
        </>
      }
    />
  );
}
