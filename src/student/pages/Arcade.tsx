import { ArcadePage } from '../../arcade/ArcadePage';
import { MascotSays } from '../../components/Mascot';
import { missions } from '../content';
import { useArcade, useDone } from '../store';

export default function Arcade() {
  const [done] = useDone();
  const [arcade, setArcade] = useArcade();
  const next = missions.find((m) => !done.includes(m.id));
  return (
    <ArcadePage
      title="🕹️ Word Arcade"
      defaultQuest={next?.module}
      onWin={(p, game) => setArcade({ points: arcade.points + p, wins: arcade.wins + 1, games: { ...arcade.games, [game]: (arcade.games[game] ?? 0) + 1 } })}
      intro={
        <MascotSays mood="happy">
          Play with this quest's words! Every win gives <b>arcade XP</b> that counts toward your rank. You have <b>{arcade.points} arcade XP</b> from{' '}
          <b>{arcade.wins} wins</b>.
        </MascotSays>
      }
    />
  );
}
