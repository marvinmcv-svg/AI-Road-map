// Student-site content loader. IMPORTANT: this must only read student-safe
// files (content/modules/*/student/*.md, module.json, course.json) — never the
// teacher lesson plans in content/modules/*/lessons.
import type { Course, ModuleData } from '../types';
import { splitStudentFrontmatter } from './frontmatter';
import courseJson from '../../content/course.json';

export interface Mission {
  id: string;
  module: string;
  number: number;
  title: string;
  mission: string;
  xp: number;
  body: string;
}

export const course = courseJson as Course;

const moduleFiles = import.meta.glob('../../content/modules/*/module.json', { eager: true, import: 'default' });
const missionFiles = import.meta.glob('../../content/modules/*/student/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});

export const modules: ModuleData[] = Object.values(moduleFiles as Record<string, ModuleData>).sort(
  (a, b) => a.number - b.number
);

export const missions: Mission[] = Object.values(missionFiles as Record<string, string>)
  .map((raw) => {
    const { meta, body } = splitStudentFrontmatter(raw);
    const m = meta as Omit<Mission, 'id' | 'body'>;
    return { ...m, id: `${m.module}/${m.number}`, body };
  })
  .sort((a, b) => a.module.localeCompare(b.module) || a.number - b.number);

export const missionsFor = (moduleId: string) => missions.filter((m) => m.module === moduleId);
export const getMission = (moduleId: string, n: number) =>
  missions.find((m) => m.module === moduleId && m.number === n);
export const getModule = (id: string) => modules.find((m) => m.id === id);
