// Public URL of the student hub (separate Vercel project, student-safe content only).
export const STUDENT_SITE_URL = 'https://ai-creators-guild.vercel.app';
export const studentMissionUrl = (moduleId: string, n: number) => `${STUDENT_SITE_URL}/#/m/${moduleId}/l/${n}`;
export const studentGuideUrl = (id: string) => `${STUDENT_SITE_URL}/#/tools/${id}`;
