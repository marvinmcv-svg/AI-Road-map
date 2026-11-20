import { parse as parseYaml } from 'yaml';
import type { Course, Gamification, Lesson, LessonMeta, ModuleData } from '../types';
import courseJson from '../../content/course.json';
import gamificationJson from '../../content/gamification.json';

export const course = courseJson as Course;
export const gamification = gamificationJson as Gamification;

const moduleFiles = import.meta.glob('../../content/modules/*/module.json', { eager: true, import: 'default' });
const lessonFiles = import.meta.glob('../../content/modules/*/lessons/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});

export const modules: ModuleData[] = Object.values(moduleFiles as Record<string, ModuleData>).sort(
  (a, b) => a.number - b.number
);

export function splitFrontmatter(raw: string): { meta: unknown; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  return { meta: parseYaml(m[1]), body: m[2] };
}

export const lessons: Lesson[] = Object.values(lessonFiles as Record<string, string>)
  .map((raw) => {
    const { meta, body } = splitFrontmatter(raw);
    const lm = meta as LessonMeta;
    return { ...lm, id: `${lm.module}/${lm.number}`, body };
  })
  .sort((a, b) => a.courseNumber - b.courseNumber);

export const getModule = (id: string) => modules.find((m) => m.id === id);
export const lessonsFor = (moduleId: string) => lessons.filter((l) => l.module === moduleId);
export const getLesson = (moduleId: string, n: number) =>
  lessons.find((l) => l.module === moduleId && l.number === n);

export const allVocab = () =>
  modules.flatMap((m) => m.vocabulary.map((v) => ({ ...v, moduleId: m.id, moduleTitle: m.title })));

export const allTools = () => {
  const seen = new Map<string, ReturnType<typeof withModule>>();
  function withModule(t: ModuleData['tools'][number], m: ModuleData) {
    return { ...t, modules: [m.title] };
  }
  for (const m of modules) {
    for (const t of m.tools) {
      const existing = seen.get(t.name);
      if (existing) existing.modules.push(m.title);
      else seen.set(t.name, withModule(t, m));
    }
  }
  return [...seen.values()];
};
