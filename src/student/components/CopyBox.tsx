import { useState } from 'react';

export function CopyBox({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="prompt-card try">
      <div className="prompt-head">
        <span>✨ {label}</span>
        <button
          type="button"
          className="copy-btn"
          onClick={async () => {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <pre>{text}</pre>
    </div>
  );
}
