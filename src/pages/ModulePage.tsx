import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { course, getModule, lessons as allLessons, lessonsFor } from '../lib/content';
import { useProgress } from '../lib/progress';
import { AgeTag } from '../components/Bits';
import { RubricTable } from './Rubrics';
import { themeFor } from '../lib/theme';
import { LessonPath, LockedPath } from '../components/LessonPath';
import { MascotSays } from '../components/Mascot';
import { FlipCard } from '../components/FlipCard';

const TABS = [
  { id: 'path', label: 'Path', icon: '🗺️' },
  { id: 'vocab', label: 'Vocabulary', icon: '🃏' },
  { id: 'tools', label: 'AI tools', icon: '🧰' },
  { id: 'quest', label: 'Quest & project', icon: '🏆' },
  { id: 'safety', label: 'Safety', icon: '🛡️' },
  { id: 'resources', label: 'Videos', icon: '📺' },
  { id: 'support', label: 'Support', icon: '🧩' }
] as const;
type TabId = (typeof TABS)[number]['id'];

export default function ModulePage() {
  const { moduleId = '' } = useParams();
  const m = getModule(moduleId);
  const summary = course.modules.find((x) => x.id === moduleId);
  const { isTaught, taught } = useProgress();
  const [tab, setTab] = useState<TabId>('path');
  const t = themeFor(summary?.number ?? 0);
  const banner = { '--c': t.color, '--s': t.shade } as React.CSSProperties;

  if (!m) {
    return (
      <div className="narrow">
        <div className="unit-banner big is-locked" style={banner}>
          <div>
            <small>MODULE {summary?.number} · WEEKS {summary?.weeks}</small>
            <h1>{summary?.title}</h1>
            <p>{summary?.lessons} lessons · Boss: {summary?.boss}</p>
          </div>
          <span className="unit-icon">{t.icon}</span>
        </div>
        <MascotSays mood="think">Plans for this module are written one module at a time. Say “next” to unlock it!</MascotSays>
        <LockedPath count={summary?.lessons ?? 5} icon={t.icon} />
      </div>
    );
  }
  const ls = lessonsFor(m.id);
  const next = allLessons.find((l) => !taught.includes(l.id));
  const doneCount = ls.filter((l) => isTaught(l.id)).length;

  return (
    <div className="narrow wide-ish">
      <div className="unit-banner big" style={banner}>
        <div>
          <small>
            MODULE {m.number} · WEEKS {m.weeks} · {ls.length} LESSONS · 60 MIN 1-ON-1 / 90 MIN GROUP
          </small>
          <h1>{m.title}</h1>
          <p>{m.subtitle}</p>
          <div className="banner-progress">
            <div style={{ width: `${(doneCount / ls.length) * 100}%` }} />
          </div>
          <small>
            {doneCount}/{ls.length} taught
          </small>
        </div>
        <span className="unit-icon">{t.icon}</span>
      </div>

      <div className="tabs no-print" role="tablist">
        {TABS.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={tab === x.id}
            className={`tab ${tab === x.id ? 'on' : ''}`}
            style={{ '--c': t.color, '--s': t.shade } as React.CSSProperties}
            onClick={() => setTab(x.id)}
          >
            <span>{x.icon}</span> {x.label}
          </button>
        ))}
      </div>

      {tab === 'path' && (
        <div className="path-layout">
          <LessonPath lessons={ls} isTaught={isTaught} nextId={next?.id} />
          <div>
            <div className="card big-idea" style={{ borderColor: t.color }}>
              <small className="eyebrow">💡 BIG IDEA</small>
              <p>{m.bigIdea}</p>
            </div>
            <div className="card">
              <h3>🎯 Students will be able to…</h3>
              <ul className="checklist">
                {m.objectives.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
            {m.carryForward && (
              <div className="card">
                <h3>🔗 Carries forward</h3>
                <p>{m.carryForward}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'vocab' && (
        <>
          <p className="muted">Tap a card to flip it. Great for Recall Raids on the projector.</p>
          <div className="flipgrid">
            {m.vocabulary.map((v) => (
              <FlipCard key={v.term} v={v} color={t.color} />
            ))}
          </div>
        </>
      )}

      {tab === 'tools' && (
        <>
          <p className="muted">Checked: {m.toolsVerified}. Free tiers and age rules change — re-check each term.</p>
          <div className="toolgrid">
            {m.tools.map((x) => (
              <div key={x.name} className="card tool">
                <div className="tool-head">
                  <b>{x.url ? <a href={x.url} target="_blank" rel="noreferrer">{x.name}</a> : x.name}</b>
                  <AgeTag tag={x.ageTag} />
                </div>
                <p>{x.bestFor}</p>
                <dl>
                  <dt>💸 Free tier</dt>
                  <dd>{x.freeTier}</dd>
                  <dt>🎂 Age rule</dt>
                  <dd>{x.minAge}</dd>
                  <dt>🏫 In class</dt>
                  <dd>{x.classroomUse}</dd>
                  <dt>🔁 Alternative</dt>
                  <dd>{x.alternative}</dd>
                </dl>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'quest' && (
        <>
          <div className="quest-grid">
            <div className="card questcard">
              <span className="big-emoji">🧭</span>
              <small className="eyebrow">QUEST LINE</small>
              <p>{m.gamification.questLine}</p>
            </div>
            <div className="card questcard">
              <span className="big-emoji">👑</span>
              <small className="eyebrow">BOSS CHALLENGE</small>
              <p>{m.gamification.boss}</p>
            </div>
            <div className="card questcard">
              <span className="big-emoji">🏅</span>
              <small className="eyebrow">MODULE BADGE</small>
              <p>{m.gamification.badge}</p>
            </div>
          </div>
          <h2>⚡ Side quests (+25 XP)</h2>
          <div className="sidequests">
            {m.gamification.sideQuests.map((q) => (
              <div key={q} className="sidequest">
                {q}
              </div>
            ))}
          </div>
          <h2>🏆 Final project: {m.finalProject.title}</h2>
          <p>{m.finalProject.brief}</p>
          <ul className="checklist">
            {m.finalProject.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <RubricTable rubric={m.finalProject.rubric} />
          <div className="callout levelup">
            <b>⚡ Level-up challenge:</b> {m.finalProject.levelUp}
          </div>
        </>
      )}

      {tab === 'safety' && (
        <div className="safety-grid">
          {m.safety.map((s) => (
            <div key={s.topic} className="card safety">
              <h3>🛡️ {s.topic}</h3>
              <p>{s.teach}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'resources' && (
        <div className="toolgrid">
          {m.resources.map((r) => (
            <div key={r.title} className="card tool">
              <div className="tool-head">
                <b>📺 {r.channel}</b>
                {r.verify && <span className="verify">verify before class</span>}
              </div>
              <p>
                <b>{r.title}</b>
              </p>
              <p className="muted">{r.why}</p>
              {r.url && (
                <a className="btn ghost small" href={r.url} target="_blank" rel="noreferrer">
                  Open link ↗
                </a>
              )}
              {r.search && (
                <p className="small">
                  Search: <code>{r.search}</code>
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'support' && (
        <div className="grid2">
          <div className="card">
            <h3>🧩 Students who struggle</h3>
            <ul className="checklist">
              {m.differentiation.support.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>🚀 Fast finishers</h3>
            <ul className="checklist">
              {m.differentiation.extension.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
