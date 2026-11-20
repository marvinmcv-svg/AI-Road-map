# Beginner-friendliness audit (teacher + student)

## What the audit checked
Every teacher lesson (68) and student mission (68), the word cards, the toolkit and both apps.

| Check | Before | After |
|---|---|---|
| Reading level (`npm run lint:content`) | Grade ~2, max 5 ✅ | Same. New guide text also checks out at about grade 2 |
| Missions that say what to do when stuck | 24 of 68 | **68 of 68**: help ladder + copyable help prompt on every mission |
| Missions that list the tools you need | 2 of 68 | **68 of 68**: "Before you start" box with tool chips |
| Step-by-step help for the tools | None (only prompt cheat sheets) | **18 Tool guides**: sign-up steps, first try, tips, "Stuck?" fixes, safety |
| Tech words used before a word card explains them | Commit, Script, Script Properties, Spending limit, Local storage, Fallback | Word cards added. Every word-card word in a mission is now **tap-to-explain** |
| Lessons with a word-for-word "Say:" script | 20 of 68 | **68 of 68**: every lesson opens with a short script |
| Lessons with a Plan B when tech breaks | 11 of 68 | **68 of 68**: "Tool help & Plan B" box on every lesson |
| Teacher onboarding | README only | **Start here** page: first week, accounts, 7-step lesson routine, tech words, Plan B |
| Things that keep students coming back (student site) | Checklists + confetti | Ranks, streaks, sticker book, side-quest spinner, Showcase portfolio, feel check |

## Still worth doing later
- Screenshots or short screen recordings for the hardest set-up steps (GitHub → Vercel, Supabase keys, Apps Script permissions). Apps change their buttons often, so the guides use "look for…" wording for now.
- Demo Day module (not written yet).
- The teacher's official XP and the student's practice XP live on different devices. A shared backend (e.g. Supabase) would sync them.
