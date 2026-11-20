import { useRef, useState } from 'react';
import { gamification } from '../lib/content';
import { KEYS, useStored } from '../lib/storage';
import { EMPTY_TRACKER, houseStandings, levelFor, xpOf as xpOfState, type TrackerState } from '../lib/xp';

const uid = () => Math.random().toString(36).slice(2, 10);

export default function Tracker() {
  const [state, setState] = useStored<TrackerState>(KEYS.tracker, EMPTY_TRACKER);
  const [name, setName] = useState('');
  const [house, setHouse] = useState(gamification.houses[0].name);
  const [selected, setSelected] = useState<string[]>([]);
  const [customXp, setCustomXp] = useState(10);
  const [reason, setReason] = useState('');
  const [badge, setBadge] = useState(gamification.badges[0].id);
  const fileRef = useRef<HTMLInputElement>(null);

  const xpOf = (id: string) => xpOfState(state, id);

  const addStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setState({ ...state, students: [...state.students, { id: uid(), name: name.trim(), house }] });
    setName('');
  };

  const award = (xp: number, why: string) => {
    if (!selected.length) return alert('Select at least one student first.');
    const at = new Date().toISOString();
    setState({
      ...state,
      log: [...state.log, ...selected.map((studentId) => ({ id: uid(), studentId, xp, reason: why, at }))]
    });
  };

  const giveBadge = () => {
    if (!selected.length) return alert('Select at least one student first.');
    const at = new Date().toISOString();
    const fresh = selected
      .filter((s) => !state.badges.some((b) => b.studentId === s && b.badgeId === badge))
      .map((studentId) => ({ studentId, badgeId: badge, at }));
    setState({ ...state, badges: [...state.badges, ...fresh] });
  };

  const undoLast = () => setState({ ...state, log: state.log.slice(0, -1) });

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ai-creators-xp-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };
  const importJson = async (f: File) => {
    try {
      const data = JSON.parse(await f.text()) as TrackerState;
      if (!Array.isArray(data.students) || !Array.isArray(data.log)) throw new Error();
      if (confirm('Replace the current tracker data with this backup?')) setState({ ...data, badges: data.badges ?? [] });
    } catch {
      alert('That file is not a valid tracker backup.');
    }
  };

  const ranked = [...state.students].sort((a, b) => xpOf(b.id) - xpOf(a.id));
  const houses = houseStandings(state);

  const toggleSel = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="narrow wide-ish">
      <h1>⭐ XP tracker</h1>
      <div className="callout">
        Privacy: use first names or Guild nicknames only. Data stays in this browser — use <b>Export backup</b> weekly.
      </div>

      <h2>House race (average XP per member)</h2>
      <div className="podium">
        {[houses[1], houses[0], houses[2], houses[3]].map((h, i) => {
          const place = [2, 1, 3, 4][i];
          return (
            <div key={h.name} className={`podium-col p${place}`}>
              <div className="podium-avatar" style={{ background: h.color }}>
                {['', '👑', '🥈', '🥉', '⭐'][place]}
              </div>
              <b>{h.name}</b>
              <small>
                {h.avg} avg · {h.n} members
              </small>
              <div className="podium-block" style={{ background: h.color }}>
                {place}
              </div>
            </div>
          );
        })}
      </div>

      <h2>Award XP</h2>
      <div className="card no-print">
        <p className="muted">
          {selected.length} selected ·{' '}
          <button className="link" onClick={() => setSelected(state.students.map((s) => s.id))}>
            select all
          </button>{' '}
          ·{' '}
          <button className="link" onClick={() => setSelected([])}>
            clear
          </button>{' '}
          · select house:{' '}
          {gamification.houses.map((h) => (
            <button
              key={h.name}
              className="link"
              onClick={() => setSelected(state.students.filter((s) => s.house === h.name).map((s) => s.id))}
            >
              {h.name}
            </button>
          ))}
        </p>
        <div className="quick">
          {gamification.xpRules
            .filter((r) => r.xp > 0)
            .map((r) => (
              <button key={r.action} className="btn chip" onClick={() => award(r.xp, r.action)}>
                +{r.xp} {r.action}
              </button>
            ))}
        </div>
        <div className="row">
          <input type="number" value={customXp} onChange={(e) => setCustomXp(Number(e.target.value))} />
          <input placeholder="Reason (e.g. helped a classmate debug)" value={reason} onChange={(e) => setReason(e.target.value)} />
          <button onClick={() => award(customXp, reason || 'Custom award')}>Award</button>
          <button className="ghost" onClick={undoLast}>
            Undo last
          </button>
        </div>
        <div className="row">
          <select value={badge} onChange={(e) => setBadge(e.target.value)}>
            {gamification.badges.map((b) => (
              <option key={b.id} value={b.id}>
                {b.icon} {b.name}
              </option>
            ))}
          </select>
          <button onClick={giveBadge}>Give badge</button>
        </div>
      </div>

      <h2>Students</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>#</th>
            <th>Name</th>
            <th>House</th>
            <th>XP</th>
            <th>Level</th>
            <th>Badges</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((s, i) => {
            const xp = xpOf(s.id);
            const lv = levelFor(xp);
            const color = gamification.houses.find((h) => h.name === s.house)?.color;
            return (
              <tr key={s.id} className={selected.includes(s.id) ? 'sel' : ''}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Select ${s.name}`}
                    checked={selected.includes(s.id)}
                    onChange={() => toggleSel(s.id)}
                  />
                </td>
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td style={{ color }}>{s.house}</td>
                <td>
                  <b>{xp}</b>
                </td>
                <td>
                  Lv {lv.level} {lv.name}
                  {lv.next && <small className="muted"> · {lv.next.xp - xp} to next</small>}
                </td>
                <td>
                  {state.badges
                    .filter((b) => b.studentId === s.id)
                    .map((b) => {
                      const def = gamification.badges.find((x) => x.id === b.badgeId);
                      return (
                        <span key={b.badgeId} title={def?.name}>
                          {def?.icon}
                        </span>
                      );
                    })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <form className="row no-print" onSubmit={addStudent}>
        <input placeholder="First name or nickname" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={house} onChange={(e) => setHouse(e.target.value)}>
          {gamification.houses.map((h) => (
            <option key={h.name}>{h.name}</option>
          ))}
        </select>
        <button type="submit">Add student</button>
      </form>

      <h2>Backup</h2>
      <div className="row no-print">
        <button onClick={exportJson}>⬇️ Export backup</button>
        <button className="ghost" onClick={() => fileRef.current?.click()}>
          ⬆️ Import backup
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])}
        />
      </div>

      <h2>Recent awards</h2>
      <ul className="log">
        {[...state.log]
          .reverse()
          .slice(0, 25)
          .map((e) => (
            <li key={e.id}>
              {new Date(e.at).toLocaleDateString()} · <b>{state.students.find((s) => s.id === e.studentId)?.name}</b> +
              {e.xp} — {e.reason}
            </li>
          ))}
      </ul>
    </div>
  );
}
