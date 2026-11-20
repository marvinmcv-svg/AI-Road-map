// Reading-level check (Flesch–Kincaid grade). Goal: 4th-grade words.
// Checks student missions and every teacher "Say:" / 1-on-1 block.
// Usage: node scripts/reading-level.mjs [--verbose]
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const MAX = 5.0; // a little room for course words like "prediction" and "hallucination"
const verbose = process.argv.includes('--verbose');

const syllables = (w) => {
  w = w.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = w.match(/[aeiouy]{1,2}/g);
  return Math.max(1, m ? m.length : 1);
};

export function grade(text) {
  const clean = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^---[\s\S]*?---/, ' ')
    .replace(/^\s*\|?[-:| ]+\|\s*$/gm, ' ')
    .replace(/\|/g, '. ')
    .replace(/^#+ .*$/gm, (h) => h.replace(/^#+ /, '') + '.')
    .replace(/^\s*[-*\d.]+\s+(\[ \]\s*)?/gm, '')
    .replace(/[*_`>#]/g, ' ')
    .replace(/\n\s*\n/g, '.\n')
    .replace(/\n/g, '. ')
    .replace(/[^\x00-\x7F]/g, ' ')
    .replace(/\d+(?:[:.]\d+)?/g, 'num');
  const sentences = clean.split(/[.!?:;]+/).map((s) => s.trim()).filter((s) => /[a-z]/i.test(s));
  const words = sentences.flatMap((s) => s.split(/[\s/–—-]+/).filter((w) => /[a-z]/i.test(w)));
  if (!words.length) return 0;
  const syl = words.reduce((a, w) => a + syllables(w), 0);
  return 0.39 * (words.length / sentences.length) + 11.8 * (syl / words.length) - 15.59;
}

// Long words (4+ syllables) are hard for 4th graders. They are only OK if they
// are course words we teach on purpose (each one is explained when it first shows up).
const TAUGHT = new Set(`
artificial intelligence prediction predictions predict hallucinate hallucinates hallucination hallucinations iteration iterations
composition information education generation generator generative technology category categories
material materials personality identity responsible responsibly originality original originals
disclosure activity activities favorite favorites
interactive accessible accessibility disability disabilities confirmation verification calculator delivery security wholesale
everything everybody everyday everywhere skateboarding relatable combination consistency watercolor superhero superheroes photographer autocomplete
`.split(/\s+/).filter(Boolean));
export function hardWords(text) {
  const words = text
    .replace(/```(prompt|try)[\s\S]*?```/g, ' ')
    .replace(/https?:\S+/g, ' ')
    .match(/[A-Za-z][a-z]+/g) || [];
  const out = new Set();
  for (const w of words) {
    const lw = w.toLowerCase();
    if (syllables(lw) >= 4 && !TAUGHT.has(lw)) out.add(lw);
  }
  return [...out];
}

const root = 'content/modules';
let bad = 0;
const rows = [];
for (const mod of readdirSync(root)) {
  for (const kind of ['student', 'lessons']) {
    const dir = join(root, mod, kind);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
      const raw = readFileSync(join(dir, f), 'utf8');
      let text = raw.replace(/^---[\s\S]*?\n---\n/, '');
      if (kind === 'lessons') {
        // Whole teacher page, minus the image prompts (written for Gemini, not kids),
        // headings and the family letter. Frontmatter text (goal, prep, tools, why) counts too.
        const fm = (raw.match(/^---\n([\s\S]*?)\n---/) || [, ''])[1];
        const fmText = [...fm.matchAll(/(?:goal|title|principle): "([^"]*)"|^\s+- "([^"]*)"/gm)].map((m) => m[1] || m[2]).join('. ');
        text = fmText + '\n\n' + text
          .replace(/^## Visuals to show[\s\S]*?(?=^## Differentiation)/m, '')
          .replace(/^#+ .*$/gm, '');
      }
      text = text.replace(/```(solo|group|teacher)\n([\s\S]*?)```/g, '$2');
      const g = grade(text);
      rows.push([`${mod}/${kind}/${f}`, g]);
      if (g > MAX) { bad++; console.error(`✗ ${mod}/${kind}/${f}: grade ${g.toFixed(1)} (max ${MAX})`); }
      const hard = hardWords(text);
      if (hard.length) { bad++; console.error(`✗ ${mod}/${kind}/${f}: hard words → ${hard.join(', ')}`); }
    }
  }
}
if (verbose) for (const [f, g] of rows) console.log(`${g.toFixed(1).padStart(5)}  ${f}`);
const avg = rows.reduce((a, [, g]) => a + g, 0) / rows.length;
if (bad) { console.error(`\n${bad} file(s) above grade ${MAX}.`); process.exit(1); }
console.log(`✓ Reading level OK: ${rows.length} files, average grade ${avg.toFixed(1)} (max ${MAX}).`);
