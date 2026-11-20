// Turns the word cards into "tap to see what it means" helpers inside missions.
import { modules } from './content';
import type { VocabTerm } from '../types';

export interface WordHelp {
  term: string;
  definition: string;
  analogy?: string;
  re: RegExp;
}

// Card names that are also everyday words. Underlining them would confuse more than help.
const SKIP = new Set(
  'copy|instructions|style|expand|noise|frame|clip|trim|pace|balance|scope|hook|app|website|model|logo|meme|remix|shape|swap|composition|timeline|captions|camera move|mechanic|workflow|accuracy|prediction|iteration|automation'.split('|')
);

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function aliases(term: string): string[] {
  const out: string[] = [];
  const paren = term.match(/^(.*?)\s*\((.*?)\)\s*$/);
  const base = paren ? paren[1] : term;
  if (paren) out.push(...paren[2].split(/\s*[/,]\s*/));
  out.push(...base.split(/\s+(?:\/|&)\s+/));
  if (/ & /.test(base)) out.push(base);
  return out.map((a) => a.trim()).filter((a) => a.length > 1 && !SKIP.has(a.toLowerCase()));
}

function help(v: VocabTerm): WordHelp | null {
  const al = aliases(v.term);
  if (!al.length) return null;
  // Short ALL-CAPS words (API, RLS, PWA) must match case; others don't.
  const caps = al.every((a) => a === a.toUpperCase());
  const re = new RegExp(`\\b(${al.map(esc).join('|')})(s|es)?\\b`, caps ? '' : 'i');
  return { term: v.term, definition: v.definition, analogy: v.analogy, re };
}

/** Word helpers for a mission: this quest's words first, then earlier quests' words. */
export function wordsFor(moduleId: string): WordHelp[] {
  const idx = modules.findIndex((m) => m.id === moduleId);
  const ordered = [modules[idx], ...modules.slice(0, idx).reverse()].filter(Boolean);
  const seen = new Set<string>();
  const out: WordHelp[] = [];
  for (const m of ordered)
    for (const v of m.vocabulary) {
      if (seen.has(v.term.toLowerCase())) continue;
      seen.add(v.term.toLowerCase());
      const h = help(v);
      if (h) out.push(h);
    }
  return out;
}
