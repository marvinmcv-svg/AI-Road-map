import { useStored } from '../lib/storage';

export interface GuildCard { nickname: string; house: string; avatar: string }
export const HOUSES = [
  { name: 'Pixel', color: '#ec4899', motto: 'We make it beautiful.' },
  { name: 'Byte', color: '#2563eb', motto: 'We make it work.' },
  { name: 'Spark', color: '#f59e0b', motto: 'We make it bold.' },
  { name: 'Nova', color: '#10b981', motto: 'We make it new.' }
];

export const useGuildCard = () => useStored<GuildCard>('guild.card', { nickname: '', house: '', avatar: '🤖' });
export const useDone = () => useStored<string[]>('guild.done', []);
export const useChecks = () => useStored<Record<string, boolean[]>>('guild.checks', {});

// Days (YYYY-MM-DD) when the student ticked a step — used for streaks.
export const useActiveDays = () => useStored<string[]>('guild.days', []);
// "What I made" for each mission: a link and a short note. Builds the Showcase.
export interface ShowcaseItem { link: string; note: string; date: string; feel?: string }
export const useShowcase = () => useStored<Record<string, ShowcaseItem>>('guild.showcase', {});
export interface ArcadeStats { points: number; wins: number; games: Record<string, number> }
export const useArcade = () => useStored<ArcadeStats>('guild.arcade', { points: 0, wins: 0, games: {} });
export const useSideQuests = () => useStored<string[]>('guild.side', []);

export const today = () => new Date().toLocaleDateString('en-CA');

// 'solo' = just me and my teacher; 'group' = a class or small group.
export type LearnMode = 'solo' | 'group';
export const useLearnMode = () => useStored<LearnMode>('guild.mode', 'solo');
