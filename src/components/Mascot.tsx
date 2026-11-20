// "Bolt" — the AI Creators Guild's original robot mascot.
export function Bolt({ size = 96, mood = 'happy' }: { size?: number; mood?: 'happy' | 'wow' | 'think' }) {
  const mouth =
    mood === 'wow' ? (
      <ellipse cx="60" cy="80" rx="7" ry="8" fill="#17224a" />
    ) : mood === 'think' ? (
      <path d="M50 80 h20" stroke="#17224a" strokeWidth="5" strokeLinecap="round" />
    ) : (
      <path d="M46 76 q14 14 28 0" stroke="#17224a" strokeWidth="5" fill="none" strokeLinecap="round" />
    );
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={`bolt bolt-${mood}`} aria-hidden="true">
      <line x1="60" y1="22" x2="60" y2="8" stroke="#ff8a2a" strokeWidth="5" strokeLinecap="round" />
      <circle cx="60" cy="8" r="7" fill="#ff8a2a" />
      <ellipse cx="60" cy="114" rx="34" ry="5" fill="#000" opacity=".08" />
      <rect x="34" y="96" width="14" height="16" rx="6" fill="#0e9a8a" />
      <rect x="72" y="96" width="14" height="16" rx="6" fill="#0e9a8a" />
      <circle cx="60" cy="64" r="42" fill="#19c2b0" />
      <circle cx="60" cy="64" r="42" fill="url(#shine)" />
      <ellipse cx="60" cy="92" rx="22" ry="10" fill="#e9fffb" />
      <circle cx="60" cy="54" r="19" fill="#fff" />
      <circle cx="60" cy="54" r="12" fill="#ffc800" />
      <circle cx="63" cy="50" r="4" fill="#fff" />
      {mouth}
      <circle cx="26" cy="70" r="6" fill="#ff8fb8" opacity=".55" />
      <circle cx="94" cy="70" r="6" fill="#ff8fb8" opacity=".55" />
      <defs>
        <radialGradient id="shine" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function MascotSays({
  children,
  mood,
  size = 88
}: {
  children: React.ReactNode;
  mood?: 'happy' | 'wow' | 'think';
  size?: number;
}) {
  return (
    <div className="mascot-says">
      <Bolt size={size} mood={mood} />
      <div className="bubble">{children}</div>
    </div>
  );
}
