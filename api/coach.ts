// AI Teaching Coach: a Vercel serverless function that answers the teacher's
// "how do I teach this?" questions with Claude, streaming the answer as plain text.
//
// Setup (Vercel → ai-creators-portal → Settings → Environment Variables):
//   ANTHROPIC_API_KEY          your Claude Console API key (set a monthly spending limit!)
//   VITE_PORTAL_PASSWORD_HASH  already set: only someone with the portal password can use the coach
import Anthropic from '@anthropic-ai/sdk';
import { createHash } from 'node:crypto';

const DEFAULT_HASH = 'bb2bb36d581733924f848c94f2cd4430d246b7be241da453f220bdb1800fd777';
const MAX_TURNS = 20;
const MAX_CHARS = 60_000;

const SYSTEM = `You are "Coach", a warm, practical teaching coach inside the AI Creators teacher portal.

The course: AI Creators, a school year of lessons for college students (18+), usually taught 1-on-1 (60-minute lessons) or in small groups (90-minute lessons). Modules: 0 Launch, 1 AI Images (Gemini), 2 AI Video (Gemini Veo + Google Vids), 3 Websites (Claude artifacts, Claude Code, GitHub, Vercel), 4 AI Agents (Claude Projects, Apps Script, Claude API), 5 Mobile Apps (Claude Code, Supabase), 6 Games (Claude artifacts and Claude Code). Every lesson has six parts: Warm-up, Mini-lesson, Hands-on build, Game / challenge, Share-out, Exit ticket. Students earn XP, belong to houses, and use a student site with missions, tool guides, a Word Arcade (Hangman, Memory Match, Quiz Blitz, Word Scramble), a Showcase portfolio, streaks and side quests. The portal has Coach mode (a step-by-step walkthrough of each lesson), a Plan B box on every lesson, and an XP tracker.

The teacher may be new to teaching and new to AI tools. Your job is to help them feel ready and confident.

How to answer:
- Start with the direct answer or the first thing to do. No long intros.
- Give numbered steps when they need to do something. Keep steps short and concrete: what to click, what to say, how long it takes.
- When useful, give a short script in quotes they can say to the student.
- Use plain, simple words. Explain any tech word in a few words the first time.
- Use the lesson context you are given (title, goal, segments, plan) and point to the exact part of the lesson.
- Adapt to 1-on-1 or group as the teacher says (default 1-on-1).
- For tool problems, give the likely fix first, then a Plan B so the lesson can go on.
- Keep answers short: usually under 200 words, unless they ask for a full plan.
- Be honest: if a tool's buttons may have changed, say "look for…" and suggest asking the tool itself.
- Keep students safe: no real personal data in AI tools, secret keys never in code or chat, test mode for payments.
- Use markdown: short headings, numbered lists, **bold** for key actions.`;

type Turn = { role: 'user' | 'assistant'; content: string };

function hash(s: string) {
  return createHash('sha256').update(s).digest('hex');
}

export async function POST(request: Request): Promise<Response> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'not_configured' }, { status: 503 });
  }
  let body: { password?: string; context?: string; messages?: Turn[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
  const expected = process.env.VITE_PORTAL_PASSWORD_HASH || DEFAULT_HASH;
  if (!body.password || hash(body.password) !== expected) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }
  const turns = (body.messages ?? []).filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim());
  if (!turns.length || turns[0].role !== 'user' || turns.length > MAX_TURNS) {
    return Response.json({ error: 'bad_request' }, { status: 400 });
  }
  const context = (body.context ?? '').slice(0, MAX_CHARS);
  if (JSON.stringify(turns).length > MAX_CHARS) {
    return Response.json({ error: 'too_long' }, { status: 413 });
  }

  const messages: Anthropic.Beta.BetaMessageParam[] = turns.map((t, i) => ({
    role: t.role,
    content: i === 0 && context ? `<portal_context>\n${context}\n</portal_context>\n\n${t.content}` : t.content
  }));

  const client = new Anthropic();
  const stream = client.beta.messages.stream({
    model: 'claude-opus-5-5',
    max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low' },
    cache_control: { type: 'ephemeral' },
    system: SYSTEM,
    messages
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === 'refusal') {
          controller.enqueue(encoder.encode('\n\n_Sorry, I can’t help with that one. Try asking it a different way._'));
        } else if (final.stop_reason === 'max_tokens') {
          controller.enqueue(encoder.encode('\n\n_(Answer cut short. Ask "continue" for the rest.)_'));
        }
      } catch (err) {
        const msg =
          err instanceof Anthropic.AuthenticationError
            ? 'The API key is not valid. Check ANTHROPIC_API_KEY in Vercel.'
            : err instanceof Anthropic.RateLimitError
              ? 'Too many questions at once. Wait a minute and try again.'
              : err instanceof Anthropic.BadRequestError
                ? 'Claude could not answer. The Console account may be out of credit or past its spending limit.'
                : 'Coach had a problem answering. Try again in a moment.';
        controller.enqueue(encoder.encode(`\n\n⚠️ ${msg}`));
      } finally {
        controller.close();
      }
    }
  });
  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
