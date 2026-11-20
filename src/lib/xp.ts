import { gamification } from './content';

export interface Student { id: string; name: string; house: string }
export interface XpEvent { id: string; studentId: string; xp: number; reason: string; at: string }
export interface BadgeAward { studentId: string; badgeId: string; at: string }
export interface TrackerState { students: Student[]; log: XpEvent[]; badges: BadgeAward[] }
export const EMPTY_TRACKER: TrackerState = { students: [], log: [], badges: [] };

export function levelFor(xp: number) {
  const lv = [...gamification.levels].reverse().find((l) => xp >= l.xp) ?? gamification.levels[0];
  const next = gamification.levels.find((l) => l.xp > xp);
  return { ...lv, next };
}

export const xpOf = (state: TrackerState, id: string) =>
  state.log.filter((e) => e.studentId === id).reduce((s, e) => s + e.xp, 0);

// Average XP per member keeps houses of different sizes fair.
export function houseStandings(state: TrackerState) {
  return gamification.houses
    .map((h) => {
      const members = state.students.filter((s) => s.house === h.name);
      const total = members.reduce((s, m) => s + xpOf(state, m.id), 0);
      return { ...h, total, avg: members.length ? Math.round(total / members.length) : 0, n: members.length };
    })
    .sort((a, b) => b.avg - a.avg);
}
