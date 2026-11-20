// Checks every lesson file: valid frontmatter, segments sum to 90 minutes,
// all six standard segments present, and required sections in the body.
// Every segment also has 1-on-1 minutes (`solo`, summing to 60) and the body has
// ```solo blocks so the lesson works with a single student.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const root = 'content/modules';
const SEGMENTS = ['Warm-up', 'Mini-lesson', 'Hands-on build', 'Game / challenge', 'Share-out', 'Exit ticket'];
const SECTIONS = ['## Lesson objectives', '## 1. Warm-up', '## 2. Mini-lesson', '## 3. Hands-on build', '## 4. Game / challenge', '## 5. Share-out', '## 6. Exit ticket', '## Visuals to show', '## Differentiation', '## XP this lesson'];
const course = JSON.parse(readFileSync('content/course.json', 'utf8'));
let errors = 0;
const fail = (f, m) => { errors++; console.error(`✗ ${f}: ${m}`); };
const courseNumbers = new Set();
let count = 0;

for (const mod of readdirSync(root)) {
  const mjson = join(root, mod, 'module.json');
  if (!existsSync(mjson)) continue;
  const m = JSON.parse(readFileSync(mjson, 'utf8'));
  const summary = course.modules.find((x) => x.id === mod);
  if (!summary) fail(mjson, 'module missing from course.json');
  const dir = join(root, mod, 'lessons');
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')) : [];
  if (summary && files.length !== summary.lessons) fail(mod, `has ${files.length} lessons, course.json says ${summary.lessons}`);
  if (m.finalProject.rubric.some((r) => r.levels.length !== 4)) fail(mjson, 'rubric rows need 4 levels');
  const sdir = join(root, mod, 'student');
  const sfiles = existsSync(sdir) ? readdirSync(sdir).filter((f) => f.endsWith('.md')) : [];
  for (const f of files) if (!sfiles.includes(f)) fail(join(sdir, f), 'student mission missing for this lesson');
  for (const f of sfiles) {
    const raw = readFileSync(join(sdir, f), 'utf8');
    const sm = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!sm) { fail(join(sdir, f), 'no frontmatter'); continue; }
    const meta = parse(sm[1]);
    for (const k of ['module', 'number', 'title', 'mission', 'xp']) if (meta[k] == null) fail(join(sdir, f), `missing ${k}`);
    for (const h of ['## 🔥 Warm-up', '## 🎟️ Exit ticket', '## 🛡️ Stay safe', '- [ ]']) if (!sm[2].includes(h)) fail(join(sdir, f), `missing "${h}"`);
    if (/```(teacher|prompt)/.test(sm[2])) fail(join(sdir, f), 'teacher-only block in student file');
    if (!sm[2].includes('```solo')) fail(join(sdir, f), 'no ```solo block (1-on-1 version of the challenge)');
  }
  for (const f of files) {
    const path = join(dir, f);
    const raw = readFileSync(path, 'utf8');
    const mm = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!mm) { fail(path, 'no frontmatter'); continue; }
    let meta;
    try { meta = parse(mm[1]); } catch (e) { fail(path, 'YAML: ' + e.message); continue; }
    count++;
    if (meta.module !== mod) fail(path, `module is ${meta.module}`);
    if (courseNumbers.has(meta.courseNumber)) fail(path, `duplicate courseNumber ${meta.courseNumber}`);
    courseNumbers.add(meta.courseNumber);
    const total = (meta.segments || []).reduce((s, x) => s + x.minutes, 0);
    if (total !== 90) fail(path, `segments sum to ${total}, expected 90`);
    const names = (meta.segments || []).map((s) => s.name);
    for (const s of SEGMENTS) if (!names.includes(s)) fail(path, `missing segment ${s}`);
    for (const s of meta.segments || []) if (!s.principle) fail(path, `segment ${s.name} has no principle`);
    for (const s of meta.segments || []) if (typeof s.solo !== 'number') fail(path, `segment ${s.name} has no solo (1-on-1) minutes`);
    const soloTotal = (meta.segments || []).reduce((a, x) => a + (x.solo || 0), 0);
    if (soloTotal !== 60) fail(path, `1-on-1 (solo) minutes sum to ${soloTotal}, expected 60`);
    const soloBlocks = (mm[2].match(/```solo/g) || []).length;
    if (soloBlocks < 4) fail(path, `only ${soloBlocks} \`\`\`solo blocks — each group activity needs a 1-on-1 swap`);
    const mini = (meta.segments || []).find((s) => s.name === 'Mini-lesson');
    if (mini && mini.minutes > 15) fail(path, 'mini-lesson longer than 15 min');
    for (const s of SECTIONS) if (!mm[2].includes(s)) fail(path, `missing section "${s}"`);
    if (!mm[2].includes('```prompt')) fail(path, 'no image prompt for visuals');
    for (const k of ['title', 'goal', 'xp', 'tools', 'prep']) if (meta[k] == null) fail(path, `missing ${k}`);
  }
}
if (errors) { console.error(`\n${errors} content problem(s).`); process.exit(1); }
console.log(`✓ ${count} lessons OK (90 min group / 60 min 1-on-1, all sections present, student missions present).`);
