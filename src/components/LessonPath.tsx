import { Link } from 'react-router-dom';
export interface PathLesson { id: string; module: string; number: number; title: string; xp: number }
import { lessonIcon, themeForId } from '../lib/theme';

// Winding path of round lesson "nodes", like a game map.
export function LessonPath({
  lessons,
  isTaught,
  nextId
}: {
  lessons: PathLesson[];
  isTaught: (id: string) => boolean;
  nextId?: string;
}) {
  return (
    <div className="path">
      {lessons.map((l, i) => {
        const t = themeForId(l.module);
        const done = isTaught(l.id);
        const current = l.id === nextId;
        const boss = i === lessons.length - 1 && lessons.length > 3;
        const offset = Math.round(Math.sin(i * 0.9) * 70);
        return (
          <div key={l.id} className="path-row" style={{ transform: `translateX(${offset}px)` }}>
            {current && <div className="start-bubble" style={{ color: t.color }}>START</div>}
            <Link
              to={`/m/${l.module}/l/${l.number}`}
              className={`node ${done ? 'done' : ''} ${current ? 'current' : ''} ${boss ? 'boss' : ''}`}
              style={
                {
                  '--c': done ? '#ffc800' : t.color,
                  '--s': done ? '#e0a800' : t.shade
                } as React.CSSProperties
              }
              aria-label={`Lesson ${l.number}: ${l.title}${done ? ' (taught)' : ''}`}
            >
              <span className="node-icon">{done ? '✔' : lessonIcon(l.title, boss)}</span>
            </Link>
            <div className="node-tip">
              <small>
                LESSON {l.number} · +{l.xp} XP
              </small>
              <b>{l.title}</b>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LockedPath({ count, icon }: { count: number; icon: string }) {
  return (
    <div className="path">
      {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
        <div key={i} className="path-row" style={{ transform: `translateX(${Math.round(Math.sin(i * 0.9) * 70)}px)` }}>
          <span className="node locked">
            <span className="node-icon">{i === 0 ? icon : '🔒'}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
