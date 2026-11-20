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
