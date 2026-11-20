import { Marked } from 'marked';
import { useMemo } from 'react';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ```prompt fences become copyable "image prompt" cards.
// ```teacher fences become highlighted teacher-script boxes.
const md = new Marked({
  gfm: true,
  renderer: {
    code({ text, lang }) {
      if (lang === 'prompt') {
        return `<div class="prompt-card"><div class="prompt-head"><span>🎨 Image prompt</span><button type="button" class="copy-btn" data-copy="${escape(
          text
        )}">Copy</button></div><pre>${escape(text)}</pre></div>`;
      }
      if (lang === 'teacher') {
        return `<div class="teacher-say"><strong>🗣️ Say:</strong> ${escape(text)}</div>`;
      }
      return `<pre><code>${escape(text)}</code></pre>`;
    }
  }
});

export function Markdown({ source }: { source: string }) {
  const html = useMemo(() => md.parse(source) as string, [source]);
  const onClick = async (e: React.MouseEvent) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.copy-btn');
    if (!btn) return;
    await navigator.clipboard.writeText(btn.dataset.copy || '');
    btn.textContent = 'Copied ✓';
    setTimeout(() => (btn.textContent = 'Copy'), 1500);
  };
  return <div className="md" onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
