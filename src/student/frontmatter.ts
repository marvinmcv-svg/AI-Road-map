import { parse } from 'yaml';
export function splitStudentFrontmatter(raw: string): { meta: unknown; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  return m ? { meta: parse(m[1]), body: m[2] } : { meta: {}, body: raw };
}
