// Visual identity per module: colour, darker "shadow" shade and an emoji icon.
export interface ModuleTheme {
  color: string;
  shade: string;
  soft: string;
  icon: string;
}

const THEMES: Record<number, ModuleTheme> = {
  0: { color: '#7c5cff', shade: '#5a3fd6', soft: '#efeaff', icon: '🚀' },
  1: { color: '#ff5fa2', shade: '#d63f80', soft: '#ffe8f2', icon: '🎨' },
  2: { color: '#ff8a2a', shade: '#d96a12', soft: '#fff0e2', icon: '🎬' },
  3: { color: '#1cb0f6', shade: '#1189c2', soft: '#e3f5fe', icon: '🌐' },
  4: { color: '#14c38e', shade: '#0e9a6f', soft: '#e1f9f1', icon: '⚙️' },
  5: { color: '#ffb800', shade: '#d69a00', soft: '#fff6d9', icon: '📱' },
  6: { color: '#ff4b4b', shade: '#d63434', soft: '#ffe7e7', icon: '🕹️' },
  7: { color: '#2b3a67', shade: '#17224a', soft: '#e7eaf4', icon: '🏆' }
};

export const themeFor = (n: number) => THEMES[n] ?? THEMES[0];
export const themeForId = (id: string) => themeFor(Number(id.slice(0, 2)));

export const SEGMENT_STYLE: Record<string, { icon: string; color: string; shade: string; n: number }> = {
  'Warm-up': { icon: '🔥', color: '#ff8a2a', shade: '#d96a12', n: 1 },
  'Mini-lesson': { icon: '💡', color: '#7c5cff', shade: '#5a3fd6', n: 2 },
  'Hands-on build': { icon: '🛠️', color: '#14c38e', shade: '#0e9a6f', n: 3 },
  'Game / challenge': { icon: '⚔️', color: '#ffb800', shade: '#d69a00', n: 4 },
  'Share-out': { icon: '🎤', color: '#ff5fa2', shade: '#d63f80', n: 5 },
  'Exit ticket': { icon: '🎟️', color: '#1cb0f6', shade: '#1189c2', n: 6 }
};

// Icon for a lesson node on the path, chosen from its title.
export function lessonIcon(title: string, isBoss: boolean) {
  if (isBoss || /boss/i.test(title)) return '👑';
  const t = title.toLowerCase();
  const pairs: [RegExp, string][] = [
    [/meme/, '😂'], [/compos|shot|photographer/, '📷'], [/logo|brand/, '✒️'], [/edit|photo/, '🪄'], [/study|flashcard/, '🧠'],
    [/market|poster|call to action/, '📣'], [/consisten|mascot/, '🤖'],
    [/noise|how image/, '🌫️'], [/wrong|hallucin|safety/, '🛡️'], [/prompt/, '💬'], [/what is ai|pattern/, '🧩']
  ];
  return pairs.find(([r]) => r.test(t))?.[1] ?? '⭐';
}
