import { useState } from 'react';
import { PASSWORD_HASH, USING_DEFAULT_PASSWORD, sha256, unlock } from '../lib/auth';
import { Bolt } from '../components/Mascot';

export default function Login({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((await sha256(pw)) === PASSWORD_HASH) {
      unlock();
      onUnlock();
    } else setErr('Hmm, that password didn’t work. Try again!');
  };
  return (
    <div className="login">
      <form onSubmit={submit} className="login-card">
        <div className={err ? 'shake' : 'float'}>
          <Bolt size={130} mood={err ? 'wow' : 'happy'} />
        </div>
        <div className="logo big">ai creators</div>
        <p className="muted">Teacher portal · staff only</p>
        <input
          type="password"
          autoFocus
          placeholder="Teacher password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setErr('');
          }}
          aria-label="Teacher password"
        />
        <button type="submit" className="btn primary wide">
          Unlock
        </button>
        {err && <p className="error">{err}</p>}
        {USING_DEFAULT_PASSWORD && <p className="hint">Default password is in the README — change it before sharing.</p>}
      </form>
    </div>
  );
}
