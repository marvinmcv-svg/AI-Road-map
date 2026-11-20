import type { Segment, Tool } from '../types';

const SEG_COLORS: Record<string, string> = {
  'Warm-up': '#22d3ee',
  'Mini-lesson': '#a78bfa',
  'Hands-on build': '#34d399',
  'Game / challenge': '#facc15',
  'Share-out': '#f472b6',
  'Exit ticket': '#fb923c'
};

export function SegmentBar({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((s, x) => s + x.minutes, 0);
  let clock = 0;
  return (
    <div className="segbar" aria-label="Lesson timeline">
      {segments.map((s) => {
        const start = clock;
        clock += s.minutes;
        return (
          <div
            key={s.name}
            className="seg"
            style={{ flexGrow: s.minutes, background: SEG_COLORS[s.name] || '#94a3b8' }}
            title={`${s.name}: ${s.minutes} min — ${s.principle}`}
          >
            <b>{s.name}</b>
            <span>
              {start}–{clock}′
            </span>
          </div>
        );
      })}
      <div className="segtotal">{total} min</div>
    </div>
  );
}

const AGE_LABEL: Record<Tool['ageTag'], string> = {
  'all-ages-school': 'School account OK',
  '13+': '13+',
  '13+consent': '13+ w/ parent OK',
  '18+': '18+ · OK for adult students',
  'teacher-only': 'Teacher only'
};

export function AgeTag({ tag }: { tag: Tool['ageTag'] }) {
  return <span className={`age age-${tag.replace('+', 'plus')}`}>{AGE_LABEL[tag]}</span>;
}
