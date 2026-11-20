import { gamification } from './content';

export function levelFor(xp: number) {
  const lv = [...gamification.levels].reverse().find((l) => xp >= l.xp) ?? gamification.levels[0];
  const next = gamification.levels.find((l) => l.xp > xp);
  return { ...lv, next };
}
