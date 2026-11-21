# AI Creators — Teacher Portal

A teacher-only, installable web app (PWA) with the full **AI Creators** curriculum for college students (18+), taught 1-on-1 or in small groups:
a school year of lessons, 2 per week, across 6 modules (Images → Video → Websites →
Agents → Mobile Apps → Games), plus a Launch module and Demo Day.

- **1-on-1 or group.** Every lesson has a 👤 1-on-1 / 👥 Group switch. 1-on-1 lessons run 60 minutes
  and swap every group activity (houses, gallery walks, duels) for a student-vs-teacher version.
  Group lessons run 90 minutes. The student site has the same switch on "My Guild card".
- **Easy words.** Lessons, teacher scripts, missions and word cards are written at about a
  4th-grade reading level. `npm run lint:content` checks it.
- **Two main tools.** Gemini for chat, pictures and video (Modules 0–2). Claude for building:
  websites, AI helpers, apps and games (Modules 3–6), using artifacts, Projects, Claude Code and the Claude API.

Every lesson has a timed plan (warm-up, mini-lesson, build, challenge, share-out, exit ticket),
the learning-science principle behind each segment, a teacher script, visuals with ready-to-copy
image prompts, safety/ethics moments, differentiation and XP.

## What's inside the portal
| Page | What it's for |
|---|---|
| Dashboard | "Next up" lesson, year progress, module cards |
| Course overview | Module sequence, lessons per module, skills progression, lesson rhythm, safety threads |
| Module pages | Objectives, vocabulary (definition / analogy / example), tools table with age rules, gamification hooks, safety, YouTube & resources, final project + rubric, differentiation |
| Lesson pages | Timeline bar, prep list, full plan, copy-able image prompts, print/PDF, present mode, private notes, "mark as taught" |
| XP tracker | Students (nicknames), houses, 2-click XP awards, badges, house leaderboard, export/import backup |
| Glossary / Tools / Rubrics | Searchable vocabulary, tool age filter, printable rubrics |
| Start here | First week checklist, accounts to set up, 7-step lesson routine, tech words in plain English, Plan B |
| Engagement | 12-move engagement playbook + what students get on their site |

Every lesson page has **▶ Coach mode** (a full-screen, step-by-step walkthrough: picture cards for what to do, a timer, "Done when" and "If it's not working" for each part, with a lesson clock),
a **💬 AI Teaching Coach** (bottom right, see below), a **🕹️ Word Arcade** for warm-ups, and a **🧭 Tool help & Plan B** box (links to the student Tool guides, common problems, what to do if tech breaks).

## What's on the student site
Quest map with missions (checkboxes, "Before you start" box, tap-to-explain words, 🆘 help ladder, "Save what you made"),
**18 Tool guides** (sign-up steps, first thing to try, tips, "Stuck?" fixes), word cards, cheat sheets,
**My Showcase** portfolio, rank + streak + sticker book, and a 🎲 side-quest spinner. See `docs/BEGINNER-AUDIT.md`.

## Status
- ✅ Module 0 — Launch (4 lessons)
- ✅ Module 1 — AI Images (9 lessons)
- ✅ Module 2 — AI Video (9 lessons, Gemini with Veo + Google Vids)
- ✅ Module 3 — Websites & E-commerce (11 lessons, Claude artifacts + Claude Code + Vercel + a test-mode checkout)
- ✅ Module 4 — AI Agents & Workflows (10 lessons, Claude Projects + Apps Script + the Claude API)
- ✅ Module 5 — Mobile Apps (12 lessons, Claude Code + Vercel + Supabase + the Claude API)
- ✅ Module 6 — Games (13 lessons, Claude artifacts + Claude Code + Supabase leaderboard + a Claude-powered character)
- ⏳ Demo Day — written next (say "next")

## Run it locally
```bash
npm install
npm run dev
```
Open the printed URL. **Default password: `change-me-teacher`** — change it before sharing.

## Change the password
```bash
npm run hash-password -- "your new password"
```
Put the printed `VITE_PORTAL_PASSWORD_HASH=...` line in `.env.local` (local) or in your host's
environment variables, then rebuild.

> ⚠️ The password screen keeps students from casually opening the portal, but a static website
> can always be inspected by someone determined. For real protection, also turn on your host's
> protection, e.g. **Vercel → Project → Settings → Deployment Protection → Password Protection**,
> or Cloudflare Access. Don't post the URL where students can see it.

## Deploy
Any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages). Build command
`npm run build`, output folder `dist`. The app uses hash URLs (`/#/m/01-images`), so no rewrite rules
are needed. After the first visit it works offline and can be installed ("Install app" in the browser).

## Turn on the AI Teaching Coach
The Coach is a chat in the teacher portal that answers "how do I teach this?" questions, using the lesson you're on.
It runs as a Vercel function (`api/coach.ts`) that calls Claude.
1. Go to platform.claude.com, add a small credit and **set a monthly spending limit**.
2. Create an API key.
3. Vercel → **ai-creators-portal** → Settings → Environment Variables → add `ANTHROPIC_API_KEY`, then redeploy.

Only someone who knows the portal password can use it (the function checks it against `VITE_PORTAL_PASSWORD_HASH`).
Until the key is added, the Coach offers a **Copy & open Claude** button that copies your question together with the whole lesson.

## Where data lives
- Curriculum content: `content/` (JSON + one Markdown file per lesson). Edit these to change lessons.
- Your progress, notes and XP tracker: this browser's local storage only. Use **XP tracker → Export
  backup** weekly; import it on another device.

## Content format (for editing or adding lessons)
`content/modules/<id>/lessons/NN.md` starts with YAML frontmatter (`title`, `goal`, `xp`, `tools`,
`prep`, `segments` with `minutes` + `principle`). In the body:
- ```` ```prompt ```` blocks render as copyable image-prompt cards
- ```` ```teacher ```` blocks render as "Say:" teacher-script boxes
- ```` ```solo ```` blocks show only in 1-on-1 mode; ```` ```group ```` blocks show only in group mode
- Each segment has `minutes` (group) and `solo` (1-on-1) — group adds up to 90, 1-on-1 to 60

`npm run lint:content` also runs `scripts/reading-level.mjs`, which fails if a lesson or mission
reads above grade 5 or uses long words that aren't on the list of taught course words.

`npm run lint:content` checks every lesson adds up to 90 minutes and has all required sections
(it also runs on `npm run build`).

## Growing into a full app later
Types live in `src/types.ts`; content loading is isolated in `src/lib/content.ts`, and stored
state in `src/lib/storage.ts`. To add real teacher logins and a shared database (e.g. Supabase),
replace those two modules with API calls — the pages don't need to change.
