// Plain-English help for the teacher: getting started, running a lesson,
// tech words, Plan B, and the engagement playbook.

export const FIRST_WEEK: { title: string; items: string[] }[] = [
  {
    title: '1. Set up the portals (15 min)',
    items: [
      'Open this portal on your laptop and click "Install app" in the browser bar, so it opens like an app and works offline.',
      'Open the Student site and install it on your phone too. That is what your student sees.',
      'Send the student ONLY the Student site link. Never this one.',
      'Read this page and the Game rules page once.'
    ]
  },
  {
    title: '2. Accounts you need (30 min)',
    items: [
      'Now: a Google account (Gemini, Slides, Vids, Forms) and a free Claude account. That covers Modules 0 to 2.',
      'By Module 3: a paid Claude plan (Pro) for Claude Code, plus free GitHub and Vercel accounts.',
      'By Module 4: a Claude Console account with a small prepaid credit and a spending limit ($5 to $10 a month is plenty for class).',
      'By Module 5: a free Supabase account.',
      'Your student makes the same accounts on their own email. Do it together in the first 10 minutes of the lesson that needs it. Each Tool guide has the steps.'
    ]
  },
  {
    title: '3. Try it yourself first (20 min a week)',
    items: [
      'Before each lesson, do the student mission yourself, start to finish. You will spot the hard steps.',
      'Write what tripped you up in "My private notes" at the bottom of the lesson. Warn your student about it.',
      "You don't need to be an expert. Saying \"Let's find out together\" is great teaching."
    ]
  }
];

export const LESSON_STEPS: { icon: string; title: string; text: string }[] = [
  { icon: '▶️', title: 'Easiest way: press "Start Coach mode"', text: 'At the top of every lesson. It walks you through the steps below one screen at a time, with picture cards, a timer and a "Done when" check. Stuck? Tap 💬 Ask Coach (bottom right) and ask in your own words.' },
  { icon: '👤', title: 'Pick 1-on-1 or Group', text: 'The switch at the top of every lesson changes the times and shows the right activities. 1-on-1 = 60 min, Group = 90 min.' },
  { icon: '📋', title: 'Do the prep list', text: 'The yellow "Prep before class" box. Most prep is opening tabs and making a demo. Use the 🧭 Tool help box if a tool is new to you.' },
  { icon: '🗺️', title: 'Follow the colored bar', text: 'Warm-up → Mini-lesson → Build → Challenge → Share-out → Exit ticket. Click a color to jump there. Times are a guide, not a rule.' },
  { icon: '🗣️', title: 'Read the "Say:" boxes out loud', text: 'They are short scripts you can read word for word. The 👤 / 👥 boxes tell you what changes for 1-on-1 or group.' },
  { icon: '🎨', title: 'Show the visuals', text: 'Copy an image prompt into Gemini before class, save the picture, and show it. Or use 📽️ Present mode to show the lesson big.' },
  { icon: '🎒', title: 'Send the student their mission', text: 'Click "Student mission ↗" and share the link. It has the same steps in student words, with checkboxes and help.' },
  { icon: '⭐', title: 'Award XP and mark as taught', text: 'Click "Mark as taught", then "Award XP" (2 clicks per student). Praise effort out loud: "+10 for fixing that bug yourself!"' }
];

export const TECH_WORDS: [string, string][] = [
  ['Prompt', 'What you type to the AI. Better prompts = better results.'],
  ['Artifact', 'Something Claude builds that you can click and use (a page, a game), shown next to the chat.'],
  ['Claude Code', 'Claude as a coder. It writes all the files of a website or app for you.'],
  ['Repo (repository)', 'A project folder on GitHub. It saves every change.'],
  ['Commit', 'One saved change in the repo, with a short note.'],
  ['Deploy', 'Putting the project online. Vercel does it by itself after each commit.'],
  ['API / API key', 'A way for an app to talk to Claude. The key is a secret password that costs money if someone steals it.'],
  ['Environment variable', 'A safe place on Vercel to keep secret keys, outside the code.'],
  ['Database', 'Where an app saves data online (Supabase in this course).'],
  ['RLS (Row Level Security)', 'A Supabase rule so each user only sees their own data. Always on.'],
  ['Hallucination', 'When AI says something false but sounds sure. Always check facts.'],
  ['Spending limit', 'A cap on how much an API account can spend in a month. Set it before class.']
];

export const PLAN_B: [string, string][] = [
  ['Wi-Fi is down', 'Do the paper version: plan prompts, storyboards, wireframes or game rules on paper. Build next lesson.'],
  ['The AI hit a daily limit', 'Switch tools (Gemini ↔ Claude), or move on to planning, feedback or the challenge. Save the build for tomorrow.'],
  ['An account won\'t sign up', 'Use your demo account to show the step. The student follows along, and makes their account at home with the Tool guide.'],
  ['Claude Code needs a paid plan', 'Build it as a Claude artifact instead (free). It is a smaller version, but it works and can be shared.'],
  ['The deploy failed', 'Open the deploy in Vercel, copy the red error, and paste it into Claude Code: "Fix this deploy error."'],
  ['The student is stuck and frustrated', 'Stop typing. Ask: "What did you expect? What happened?" Then use the help prompt at the bottom of their mission.'],
  ['You don\'t know the answer', 'Say "Great question. Let\'s ask Claude together." Showing how YOU get unstuck is the best lesson.']
];

export interface Play {
  icon: string;
  title: string;
  why: string;
  how: string[];
}

export const PLAYBOOK: Play[] = [
  {
    icon: '⚡',
    title: 'Win in the first 5 minutes',
    why: 'An early "I made that!" moment builds confidence for the hard parts.',
    how: ['Start every lesson with something that works fast (the warm-up prompt, a quick picture).', 'Say out loud what they just did well.']
  },
  {
    icon: '🎯',
    title: 'Let them choose the topic',
    why: 'People work harder on things they care about.',
    how: ['Swap the example brand (Sip Squad) for their hobby, sport, music or side hustle.', 'Ask at the start of each module: "What would YOU want to make?"']
  },
  {
    icon: '🌍',
    title: 'Give it a real audience',
    why: 'Work for a real person feels important. Work for a grade feels like homework.',
    how: [
      'Have them send their link to a friend or family member each week.',
      'Ask them to collect 1 real piece of feedback ("I wonder…").',
      'Plan Demo Day early and invite 2 or 3 guests.'
    ]
  },
  {
    icon: '🔥',
    title: 'Use streaks and the side-quest spinner',
    why: 'Small daily wins build a habit.',
    how: [
      'The student site counts days in a row. Ask "What\'s your streak?" at the start of class.',
      'End early? Spin a 🎲 side quest together (10 min, +10 XP).',
      'Give a small perk at 7 days in a row (they pick the warm-up song).'
    ]
  },
  {
    icon: '🖼️',
    title: 'Build the Showcase every week',
    why: 'Seeing a growing portfolio is proof of progress, and it is useful for jobs and classes.',
    how: ['At the end of each mission, have them fill in "Save what you made".', 'Once a month, scroll the Showcase together and pick a favorite.']
  },
  {
    icon: '🐞',
    title: 'Celebrate mistakes and bugs',
    why: 'Fear of looking dumb is the #1 reason beginners quit.',
    how: [
      'Give XP for fixing, not just for getting it right first time.',
      'Make your own mistakes in front of them, and fix them out loud.',
      'Give the secret 🐞 Bug Hunter badge the first time they fix a bug by explaining it to the AI.'
    ]
  },
  {
    icon: '🤔',
    title: 'Check the feel, not just the work',
    why: 'Students often hide that they are lost.',
    how: [
      'Each mission ends with "How did this feel?" (😎 🙂 🤔 😵). Ask them to show you.',
      'If they pick 😵, go back to the step that lost them before moving on. Use the extra-help idea in the lesson\'s Differentiation box.'
    ]
  },
  {
    icon: '🎮',
    title: 'Play YOU vs. THEM',
    why: 'In 1-on-1, a little friendly competition replaces the group energy.',
    how: ['Every challenge has a "Student vs. Teacher" version. Really play it, and let them beat you sometimes.', 'Keep a running score on a sticky note for the whole module.']
  },
  {
    icon: '🕹️',
    title: 'Play word games often',
    why: 'Games turn review into fun, and words that are played with get remembered.',
    how: ['Open the Word Arcade (menu) for a 5-minute warm-up: Hangman, Memory Match, Quiz Blitz or Word Scramble.', '1-on-1: take turns. You read the clue, they guess, then swap.', 'Students win arcade XP on their own site too.']
  },
  {
    icon: '🎲',
    title: 'Add surprise',
    why: 'Surprise grabs attention and makes lessons memorable.',
    how: ['Mystery prompt: hide a prompt in an envelope and reveal it.', 'Random rule: "This picture must include a pineapple."', 'Secret badges: don\'t say how to earn them until they do.']
  },
  {
    icon: '🗣️',
    title: 'Make them the teacher',
    why: 'Explaining something is the fastest way to really learn it.',
    how: ['Ask "Teach me how you did that" at the share-out.', 'Have them show a family member or friend (that earns the 🤝 Guild Mentor badge).']
  },
  {
    icon: '🪜',
    title: 'Small steps, always',
    why: 'Big jumps make beginners freeze.',
    how: ['If they are stuck, shrink the step: "Just make the button. Nothing else."', 'Tick boxes on the student site. Each tick is a tiny win.']
  },
  {
    icon: '🏆',
    title: 'Make Boss Week a big deal',
    why: 'A clear finish line with a reward gives each module a story.',
    how: ['Count down to Boss Week ("3 lessons to the Boss!").', 'Make a little ceremony when you give the module badge: print it, or post it on the Showcase wall.']
  }
];
