// Fun extras for students: ranks, streaks, stickers and side quests.
// Practice XP here is the student's own count. The teacher keeps the official score.
import { levels } from '../../content/gamification.json';
import type { Mission } from './content';

export const LEVELS = levels as { level: number; name: string; xp: number; perk: string }[];

export function rankFor(xp: number) {
  let cur = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.xp) cur = l;
  const next = LEVELS.find((l) => l.xp > xp);
  const pct = next ? Math.round(((xp - cur.xp) / (next.xp - cur.xp)) * 100) : 100;
  return { cur, next, pct };
}

/** Days in a row (ending today or yesterday) with at least one ticked step. */
export function streak(days: string[]): number {
  const set = new Set(days);
  const d = new Date();
  const key = (x: Date) => x.toLocaleDateString('en-CA');
  if (!set.has(key(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(key(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export interface Sticker {
  id: string;
  icon: string;
  name: string;
  how: string;
  got: boolean;
}

export function stickers(opts: {
  done: string[];
  missions: Mission[];
  modules: { id: string; title: string }[];
  streak: number;
  bestStreak: number;
  showcase: number;
  side: number;
}): Sticker[] {
  const { done, missions, modules, bestStreak, showcase, side } = opts;
  const list: Sticker[] = [
    { id: 'first', icon: '🌱', name: 'First Step', how: 'Finish your first mission.', got: done.length >= 1 },
    { id: 'three', icon: '🎩', name: 'Hat Trick', how: 'Finish 3 missions.', got: done.length >= 3 },
    { id: 'ten', icon: '🔟', name: 'Double Digits', how: 'Finish 10 missions.', got: done.length >= 10 },
    { id: 'half', icon: '⛰️', name: 'Halfway Hero', how: 'Finish half of all missions.', got: done.length >= missions.length / 2 },
    { id: 'streak3', icon: '🔥', name: 'Warming Up', how: 'Work 3 days in a row.', got: bestStreak >= 3 },
    { id: 'streak7', icon: '☄️', name: 'Unstoppable', how: 'Work 7 days in a row.', got: bestStreak >= 7 },
    { id: 'show1', icon: '🖼️', name: 'Show-off', how: 'Save your first thing in My Showcase.', got: showcase >= 1 },
    { id: 'show10', icon: '🏛️', name: 'Museum Maker', how: 'Save 10 things in My Showcase.', got: showcase >= 10 },
    { id: 'side1', icon: '🎲', name: 'Side Quester', how: 'Finish a side quest.', got: side >= 1 },
    { id: 'side10', icon: '🧭', name: 'Explorer', how: 'Finish 10 side quests.', got: side >= 10 }
  ];
  for (const m of modules) {
    const ms = missions.filter((x) => x.module === m.id);
    if (!ms.length) continue;
    list.push({
      id: `quest-${m.id}`,
      icon: '🏆',
      name: `${m.title} Cleared`,
      how: `Finish every ${m.title} mission.`,
      got: ms.every((x) => done.includes(x.id))
    });
  }
  return list;
}

/** Best streak ever, from all saved days. */
export function bestStreak(days: string[]): number {
  const sorted = [...new Set(days)].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const s of sorted) {
    const d = new Date(s + 'T12:00:00');
    run = prev && Math.round((d.getTime() - prev.getTime()) / 86400000) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

// 10-minute side quests: quick, fun, optional. Teachers can give +10 XP each.
export const SIDE_QUESTS: Record<string, string[]> = {
  '00-launch': [
    'Ask Gemini AND Claude the same question. Which answer is better? Why?',
    'Get the AI to explain your favorite hobby to a 5-year-old, then to a pro.',
    'Make the AI say something false on purpose. Then catch it with a real source.',
    'Play 3 rounds of Quick, Draw! Which doodle did it miss? Why do you think so?',
    'Write the worst prompt you can. Then fix it with the Prompt Recipe. Compare!'
  ],
  '01-images': [
    'Make the same cat in 5 styles: pixel art, watercolor, clay, comic, photo.',
    'Make a picture with a 3-word sign in it. Can you get the spelling perfect?',
    'Turn a boring object on your desk into a superhero poster.',
    'Make a "spot the difference" pair of pictures. Test a friend.',
    'Design a sticker of your Guild avatar, square 1:1, white border.'
  ],
  '02-video': [
    'Make a 1-shot video with a crazy camera move: fly through a keyhole!',
    'Write a 3-second hook for a video about socks. Make it impossible to skip.',
    'Make a clip with only sound effects telling the story. No words.',
    'Remake a nursery rhyme as a movie trailer (storyboard 4 boxes).',
    'Find a real video online and list 3 clues it is real, or fake.'
  ],
  '03-web': [
    'Ask Claude for a one-page site for a made-up pet hotel. Publish it.',
    'Add a dark mode button to any artifact page you made.',
    'Make a "pick your pizza" calculator as an artifact.',
    'Use a screen reader on your site for 2 minutes. Fix one thing.',
    'Rewrite your hero line 5 ways. Ask a friend which one wins.'
  ],
  '04-agents': [
    'Write down 3 boring tasks you do each week. Which could a helper do?',
    'Try to trick your Project helper into breaking a rule. Then fix the rule.',
    'Ask Claude for a script that emails you a joke every Monday (test sheet only).',
    'Write 5 test questions for your helper, with the right answers.',
    'Make your helper answer like a pirate, but still get facts right.'
  ],
  '05-apps': [
    'Sketch your dream app on paper in 3 screens. Take a photo.',
    'Ask Claude to make a clickable prototype of a habit tracker.',
    'Find 3 things in your favorite app that sit in the thumb zone.',
    'Add one "celebration" moment (confetti, sound) to your app.',
    'Get one person to try your app without help. Write down where they got stuck.'
  ],
  '06-games': [
    'Make a 1-button game as an artifact in 10 minutes.',
    'Add "game juice" to any game: shake, sound, sparkles.',
    'Invent a new rule for tag. Write it as a core loop.',
    'Make an NPC that only talks in rhymes (ready-made lines are fine).',
    'Play a friend\'s game and give I like / I wonder / Try feedback.'
  ]
};

export const ALL_SIDE_QUESTS = Object.entries(SIDE_QUESTS).flatMap(([mod, qs]) => qs.map((q, i) => ({ id: `${mod}/${i}`, module: mod, text: q })));
