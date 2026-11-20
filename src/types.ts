// Shared content schema. The portal reads static files today; a future backend
// (e.g. Supabase) can return the same shapes so the UI does not change.

export interface CourseModuleSummary {
  id: string; // matches folder name, e.g. "01-images"
  number: number;
  title: string;
  lessons: number;
  weeks: string;
  boss: string;
  status: 'ready' | 'coming-next';
}

export interface Course {
  title: string;
  tagline: string;
  audience: string;
  schedule: {
    duration: string;
    meetings: string;
    lessonLength: string;
    totalSlots: number;
    planned: number;
    buffer: number;
  };
  budget: string;
  modules: CourseModuleSummary[];
  progression: { stage: string; modules: string; studentsCan: string }[];
  lessonTemplate: { segment: string; minutes: string; purpose: string }[];
  safetyThreads: { thread: string; how: string }[];
  ageRuleKey: { tag: string; meaning: string }[];
}

export interface Level { level: number; name: string; xp: number; perk: string }
export interface Badge { id: string; name: string; icon: string; how: string; module?: string; secret?: boolean }
export interface XpRule { action: string; xp: number; notes: string }

export interface Gamification {
  story: string;
  xpRules: XpRule[];
  levels: Level[];
  badges: Badge[];
  houses: { name: string; color: string; motto: string }[];
  rituals: { name: string; when: string; how: string; principle: string }[];
  moduleHooks: { module: string; questLine: string; boss: string; badge: string }[];
  fairness: string[];
}

export interface VocabTerm {
  term: string;
  definition: string;
  analogy: string;
  example: string;
}

export interface Tool {
  name: string;
  bestFor: string;
  freeTier: string;
  minAge: string;
  ageTag: 'all-ages-school' | '13+' | '13+consent' | '18+' | 'teacher-only';
  classroomUse: string;
  alternative: string;
  url?: string;
}

export interface Resource {
  channel: string;
  title: string;
  why: string;
  url?: string;
  search?: string;
  verify: boolean;
}

export interface RubricCriterion {
  criterion: string;
  levels: [string, string, string, string]; // 1 Beginning .. 4 Pro
}

export interface ModuleData {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  weeks: string;
  bigIdea: string;
  objectives: string[];
  vocabulary: VocabTerm[];
  tools: Tool[];
  toolsVerified: string;
  resources: Resource[];
  gamification: {
    questLine: string;
    badge: string;
    boss: string;
    sideQuests: string[];
  };
  safety: { topic: string; teach: string }[];
  finalProject: {
    title: string;
    brief: string;
    deliverables: string[];
    rubric: RubricCriterion[];
    levelUp: string;
  };
  differentiation: {
    support: string[];
    extension: string[];
  };
  carryForward?: string;
}

export interface Segment {
  name: string;
  minutes: number;
  solo: number; // minutes when teaching 1-on-1
  principle: string;
}

export interface LessonMeta {
  module: string;
  number: number; // within module
  courseNumber: number; // 1..70 across the year
  title: string;
  goal: string;
  xp: number;
  segments: Segment[];
  tools: string[];
  prep: string[];
}

export interface Lesson extends LessonMeta {
  id: string; // `${module}/${number}`
  body: string; // markdown
}
