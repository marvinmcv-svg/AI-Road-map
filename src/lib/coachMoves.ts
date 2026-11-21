// The teacher's "moves" for each part of a lesson, shown as picture cards in Coach mode.
// Same for every lesson, so a new teacher always knows what to do next.

export interface Move {
  icon: string;
  title: string;
  text: string;
}

export interface SegmentCoach {
  goal: string;
  moves: Move[];
  doneWhen: string;
  ifStuck: string;
}

export const COACH: Record<string, SegmentCoach> = {
  'Warm-up': {
    goal: 'Wake up their brain and connect to last lesson.',
    moves: [
      { icon: '⏱️', title: 'Start the timer', text: 'Tap Start below. Keep it short and fun.' },
      { icon: '🗣️', title: 'Read the "Say:" box', text: 'Read it out loud, word for word. It sets up the whole lesson.' },
      { icon: '❓', title: 'Ask, then wait', text: 'Ask the warm-up question. Count to 5 in your head before you help.' },
      { icon: '⭐', title: 'Praise any try', text: 'Any honest answer = +10 XP. Being wrong is fine here!' }
    ],
    doneWhen: 'The student has answered and is curious about today.',
    ifStuck: 'Give two choices: "Is it A or B?" Or play 2 minutes of the Word Arcade instead.'
  },
  'Mini-lesson': {
    goal: 'Show the one new idea, fast and clear.',
    moves: [
      { icon: '🖼️', title: 'Show the visual', text: 'Show Visual 1 (make it in Gemini before class from the prompt in the lesson).' },
      { icon: '🎬', title: 'Do it once, out loud', text: 'Demo the steps on your screen. Say what you are thinking as you click.' },
      { icon: '🔁', title: 'Have them say it back', text: '"Tell me the steps in your own words." Fix any mix-ups.' },
      { icon: '👍', title: 'Quick check', text: '"Ready to try it? Thumbs up, sideways or down?"' }
    ],
    doneWhen: 'The student can say the steps back. Keep it short. They learn more by doing.',
    ifStuck: 'Show it one more time, slower, with fewer words. Then let them try.'
  },
  'Hands-on build': {
    goal: 'The student makes the real thing. This is the heart of the lesson.',
    moves: [
      { icon: '🎒', title: 'Send the mission link', text: 'They follow the same steps, with checkboxes and help, on the student site.' },
      { icon: '⌨️', title: 'Hand over the keyboard', text: 'The student clicks and types. You sit beside them. Hands off!' },
      { icon: '🤔', title: 'Ask, don\'t fix', text: '"What did you expect? What happened? What could you try?"' },
      { icon: '🏁', title: 'Celebrate checkpoints', text: 'At each checkpoint, stop, cheer and give the XP.' }
    ],
    doneWhen: 'The checkpoints in the plan are reached (it doesn\'t have to be perfect).',
    ifStuck: 'Shrink the step ("just the button"), use the 🆘 help prompt in their mission, or the Plan B box.'
  },
  'Game / challenge': {
    goal: 'Use the new skill in a fun, fast way.',
    moves: [
      { icon: '📣', title: 'Rules in one sentence', text: 'Read the challenge rules. Check they understand the goal.' },
      { icon: '⏱️', title: 'Start the timer', text: 'Time pressure makes it a game. Count down the last 10 seconds.' },
      { icon: '🎮', title: 'Play for real', text: '1-on-1: you really play against them. Let them win sometimes!' },
      { icon: '⭐', title: 'Award XP', text: 'Everyone who played gets XP. The winner gets the bonus.' }
    ],
    doneWhen: 'The game is played and a winner is cheered.',
    ifStuck: 'Make it easier (more time, fewer items), or switch to a Word Arcade game.'
  },
  'Share-out': {
    goal: 'Show the work to someone and get kind feedback.',
    moves: [
      { icon: '🎤', title: 'Student shows', text: '"Show me what you made, and one thing you\'re proud of."' },
      { icon: '💬', title: 'Give feedback', text: 'Use the 3 starters: I like… / I wonder… / Try…' },
      { icon: '🖼️', title: 'Save to Showcase', text: 'Have them fill in "Save what you made" at the bottom of their mission.' }
    ],
    doneWhen: 'The work was shown and saved.',
    ifStuck: 'Not finished? Share what IS done. Showing unfinished work is brave and normal.'
  },
  'Exit ticket': {
    goal: 'Check what stuck, and plan next time.',
    moves: [
      { icon: '🎟️', title: 'Ask the 3 questions', text: 'Out loud is fine in 1-on-1. Don\'t give the answers. Just listen.' },
      { icon: '😵', title: 'Check the feel', text: 'Ask them to show you how the mission felt (😎 🙂 🤔 😵).' },
      { icon: '📝', title: 'Write one note', text: 'In "My private notes": what to repeat next lesson.' }
    ],
    doneWhen: 'You know what they got and what to review next time.',
    ifStuck: 'If they miss an answer, write it down and use it in next lesson\'s warm-up.'
  }
};
