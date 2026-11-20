import { KEYS, useStored } from './storage';

export function useProgress() {
  const [taught, setTaught] = useStored<string[]>(KEYS.progress, []);
  const toggle = (id: string) =>
    setTaught((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  return { taught, toggle, isTaught: (id: string) => taught.includes(id) };
}
