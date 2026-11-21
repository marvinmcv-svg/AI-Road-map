// Word lists for the arcade games, built from each quest's word cards.
// Shared by the student site and the teacher portal (student-safe data only).
import type { ModuleData, VocabTerm } from '../types';

const files = import.meta.glob('../../content/modules/*/module.json', { eager: true, import: 'default' });
export const QUESTS: ModuleData[] = Object.values(files as Record<string, ModuleData>).sort((a, b) => a.number - b.number);

export interface Word {
  answer: string; // what you type/guess, e.g. "HALLUCINATION"
  shown: string; // the card name, e.g. "Hallucination"
  clue: string; // the definition
  extra?: string; // the analogy
  quest: string;
}

/** "Repo & deploy" → "REPO & DEPLOY"; "Call to action (CTA)" → "CALL TO ACTION". */
export function toWord(v: VocabTerm, quest: string): Word {
  const shown = v.term.replace(/\s*\(.*?\)\s*/g, '').trim();
  return { answer: shown.toUpperCase(), shown, clue: v.definition, extra: v.analogy, quest };
}

export function wordsFor(questIds: string[]): Word[] {
  return QUESTS.filter((q) => questIds.includes(q.id)).flatMap((q) => q.vocabulary.map((v) => toWord(v, q.id)));
}

export const shuffle = <T,>(xs: T[]): T[] => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const isLetter = (c: string) => /[A-Z]/.test(c);
