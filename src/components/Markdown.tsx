import { Marked } from 'marked';
import { useMemo } from 'react';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ```prompt fences become copyable "image prompt" cards.
// ```teacher fences become highlighted teacher-script boxes.
const md = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth, text }) {
      const inner = this.parser.parseInline(tokens);
      const seg = depth === 2 && text.match(/^(\d)\./);
      const id = seg ? `seg-${seg[1]}` : depth === 2 && /visuals/i.test(text) ? 'visuals' : undefined;
      return `<h${depth}${id ? ` id="${id}"` : ''}${seg ? ` class="seg-h seg-h${seg[1]}"` : ''}>${inner}</h${depth}>`;
    },
    code({ text, lang }) {
      if (lang === 'prompt') {
        return `<div class="prompt-card"><div class="prompt-head"><span>🎨 Image prompt</span><button type="button" class="copy-btn" data-copy="${escape(
          text
        )}">Copy</button></div><pre>${escape(text)}</pre></div>`;
      }
      if (lang === 'try') {
        return `<div class="prompt-card try"><div class="prompt-head"><span>✨ Try this prompt</span><button type="button" class="copy-btn" data-copy="${escape(
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

export function Markdown({ source, className = '' }: { source: string; className?: string }) {
  const html = useMemo(() => md.parse(source) as string, [source]);
  const onClick = async (e: React.MouseEvent) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.copy-btn');
    if (!btn) return;
    await navigator.clipboard.writeText(btn.dataset.copy || '');
    btn.textContent = 'Copied ✓';
    setTimeout(() => (btn.textContent = 'Copy'), 1500);
  };
  return <div className={`md ${className}`} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
