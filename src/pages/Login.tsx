import { useState } from 'react';
import { PASSWORD_HASH, USING_DEFAULT_PASSWORD, sha256, unlock } from '../lib/auth';

export default function Login({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((await sha256(pw)) === PASSWORD_HASH) {
      unlock();
      onUnlock();
    } else setErr('Wrong password.');
  };
  return (
    <div className="login">
      <form onSubmit={submit} className="card">
        <div className="brand big">✦ AI Creators</div>
        <p>Teacher portal — staff only.</p>
        <input
          type="password"
          autoFocus
          placeholder="Teacher password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          aria-label="Teacher password"
        />
        <button type="submit">Unlock</button>
        {err && <p className="error">{err}</p>}
        {USING_DEFAULT_PASSWORD && (
          <p className="hint">
            Default password is in the README. Change it before sharing the link (see “Change the password”).
          </p>
        )}
      </form>
    </div>
  );
}
