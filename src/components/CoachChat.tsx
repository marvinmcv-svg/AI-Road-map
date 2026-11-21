import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getModule, lessons } from '../lib/content';
import { coachPassword, setCoachPassword } from '../lib/auth';
import { KEYS, useStored, type TeachMode } from '../lib/storage';
import { Markdown } from './Markdown';
import { Bolt } from './Mascot';

type Turn = { role: 'user' | 'assistant'; content: string };

const GENERAL = [
  'How do I get ready for my very first lesson?',
  'How do I keep my student motivated all year?',
  'How do XP, houses and badges work? Keep it simple.',
  'My student is much faster (or slower) than the plan. What do I do?'
];
const LESSON = [
  'Walk me through how to start this lesson, step by step.',
  "Explain this lesson's main tool to me like I've never used it.",
  'My student is stuck in the build. What should I do and say?',
  'I only have 30 minutes today. What do I keep and what do I cut?',
  'How can I make this lesson easier for a beginner?',
  'How can I make this lesson more fun?',
  "The tech isn't working. What's my Plan B?"
];

function useContext(mode: TeachMode) {
  const { pathname } = useLocation();
  return useMemo(() => {
    const lm = pathname.match(/^\/m\/([^/]+)\/l\/(\d+)/);
    const mm = pathname.match(/^\/m\/([^/]+)/);
    const how = mode === 'solo' ? '1-on-1 (60 minutes)' : 'a group (90 minutes)';
    if (lm) {
      const l = lessons.find((x) => x.module === lm[1] && x.number === Number(lm[2]));
      const m = getModule(lm[1]);
      if (l && m) {
        const segs = l.segments.map((s) => `${s.name}: ${mode === 'solo' ? s.solo : s.minutes} min`).join('; ');
        return {
          label: `Lesson ${l.number}: ${l.title}`,
          kind: 'lesson' as const,
          text: `The teacher is looking at this lesson and teaches ${how}.\nModule ${m.number}: ${m.title}\nLesson ${l.number} (course lesson ${l.courseNumber}): ${l.title}\nGoal: ${l.goal}\nTimings: ${segs}\nTools: ${l.tools.join(' | ')}\nPrep: ${l.prep.join(' | ')}\n\nFull lesson plan:\n${l.body}`
        };
      }
    }
    if (mm) {
      const m = getModule(mm[1]);
      if (m)
        return {
          label: `Module ${m.number}: ${m.title}`,
          kind: 'module' as const,
          text: `The teacher is looking at Module ${m.number}: ${m.title} and teaches ${how}.\nBig idea: ${m.bigIdea}\nObjectives: ${m.objectives.join(' | ')}\nTools: ${m.tools.map((t) => t.name).join(', ')}\nFinal project: ${JSON.stringify(m.finalProject).slice(0, 1500)}`
        };
    }
    return { label: 'The whole course', kind: 'general' as const, text: `The teacher is on the "${pathname}" page of the portal and teaches ${how}.` };
  }, [pathname, mode]);
}

export default function CoachChat() {
  const [open, setOpen] = useState(false);
  const [mode] = useStored<TeachMode>(KEYS.mode, 'solo');
  const ctx = useContext(mode);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<'' | 'off' | 'pw' | 'error'>('');
  const [pw, setPw] = useState('');
  const [copied, setCopied] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const lastCtx = useRef(ctx.label);

  // New lesson = new conversation (the context changed).
  useEffect(() => {
    if (lastCtx.current !== ctx.label && !busy) {
      setTurns([]);
      lastCtx.current = ctx.label;
    }
  }, [ctx.label, busy]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  const ask = async (q: string) => {
    const question = q.trim();
    if (!question || busy) return;
    const next: Turn[] = [...turns, { role: 'user', content: question }];
    setTurns([...next, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);
    setStatus('');
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: coachPassword(), context: ctx.text, messages: next.slice(-20) })
      });
      if (!res.ok || !res.body) {
        const code = res.status === 401 ? 'pw' : res.status === 503 || res.status === 404 ? 'off' : 'error';
        setStatus(code);
        setTurns(next.slice(0, -1));
        setInput(question);
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let text = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        setTurns([...next, { role: 'assistant', content: text }]);
      }
    } catch {
      setStatus('off');
      setTurns(next.slice(0, -1));
      setInput(question);
    } finally {
      setBusy(false);
    }
  };

  const claudePrompt = `You are a friendly teaching coach. I teach an AI course for college students and I'm new to teaching it. Answer in plain words with short numbered steps and a short script I can say.\n\n${ctx.text.slice(0, 12000)}\n\nMy question: ${input || '(type your question here)'}`;

  return (
    <>
      <button className={`coach-fab no-print ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="Ask Coach">
        {open ? '✕' : '💬'} <span>{open ? 'Close' : 'Ask Coach'}</span>
      </button>
      {open && (
        <div className="coach-panel no-print" role="dialog" aria-label="AI Teaching Coach">
          <div className="coach-panel-head">
            <Bolt size={40} mood="happy" />
            <div>
              <b>AI Teaching Coach</b>
              <small>Knows: {ctx.label}</small>
            </div>
            {turns.length > 0 && (
              <button className="btn ghost small" onClick={() => setTurns([])}>
                New chat
              </button>
            )}
          </div>
          <div className="coach-msgs">
            {turns.length === 0 && (
              <div className="coach-welcome">
                <p>
                  Hi! Ask me anything about <b>how to teach</b> this, in your own words. For example: "What do I say first?" or "My student
                  finished early, now what?"
                </p>
                <small className="eyebrow">QUICK QUESTIONS</small>
                <div className="coach-chips">
                  {(ctx.kind === 'lesson' ? LESSON : GENERAL).map((q) => (
                    <button key={q} className="chip-q" onClick={() => ask(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {turns.map((t, k) => (
              <div key={k} className={`bubble ${t.role}`}>
                {t.role === 'assistant' ? t.content ? <Markdown source={t.content} /> : <span className="typing">Coach is thinking…</span> : t.content}
              </div>
            ))}
            {status === 'pw' && (
              <div className="coach-alert">
                <p>Coach needs your portal password once on this device.</p>
                <div className="row">
                  <input type="password" placeholder="Teacher password" value={pw} onChange={(e) => setPw(e.target.value)} />
                  <button
                    className="btn primary small"
                    onClick={() => {
                      setCoachPassword(pw);
                      setPw('');
                      setStatus('');
                      ask(input);
                    }}
                  >
                    Save & ask
                  </button>
                </div>
              </div>
            )}
            {(status === 'off' || status === 'error') && (
              <div className="coach-alert">
                <p>
                  <b>{status === 'off' ? "The AI Coach isn't switched on yet." : 'Coach had a problem.'}</b> You can still ask: this button copies your question{' '}
                  <i>with the whole lesson</i>, then opens Claude. Just paste (Ctrl/Cmd + V) and send.
                </p>
                <button
                  className="btn primary small"
                  onClick={async () => {
                    await navigator.clipboard.writeText(claudePrompt);
                    setCopied(true);
                    window.open('https://claude.ai/new', '_blank', 'noopener');
                  }}
                >
                  {copied ? '✓ Copied. Paste it in Claude' : '📋 Copy & open Claude'}
                </button>
                {status === 'off' && (
                  <details>
                    <summary>How to switch the Coach on (5 min, one time)</summary>
                    <ol>
                      <li>Go to platform.claude.com, add a little credit and set a monthly spending limit (like $10).</li>
                      <li>Create an API key and copy it.</li>
                      <li>In Vercel, open ai-creators-portal → Settings → Environment Variables.</li>
                      <li>
                        Add <code>ANTHROPIC_API_KEY</code> with your key, then Redeploy.
                      </li>
                    </ol>
                  </details>
                )}
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form
            className="coach-input"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <textarea
              rows={2}
              value={input}
              placeholder="Ask how to teach this… (Enter to send)"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  ask(input);
                }
              }}
            />
            <button className="btn primary" disabled={busy || !input.trim()}>
              {busy ? '…' : 'Ask'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
