import { useEffect, useState } from 'react';

// Small localStorage-backed state hook. Swap for an API client when the
// portal becomes a full app.
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

export const KEYS = {
  session: 'aic.session',
  progress: 'aic.progress',
  tracker: 'aic.tracker',
  notes: 'aic.notes',
  mode: 'aic.mode'
};

// How the teacher is running lessons: 1-on-1 (default) or with a group.
export type TeachMode = 'solo' | 'group';
