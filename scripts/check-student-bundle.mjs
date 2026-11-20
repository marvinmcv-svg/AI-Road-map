// Safety net: fail the student build if any teacher-only text leaked in.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const dir = 'dist-student';
const files = [];
const walk = (d) => readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(join(d, e.name)) : files.push(join(d, e.name))));
walk(dir);
const markers = ['Teacher-led alternative', '## Visuals to show', 'Worked example (think aloud)', 'Family letter', 'change-me-teacher', 'courseNumber'];
let bad = 0;
for (const f of files.filter((f) => /\.(js|html|css)$/.test(f))) {
  const txt = readFileSync(f, 'utf8');
  for (const m of markers) if (txt.includes(m)) { console.error(`✗ ${f} contains teacher-only text: "${m}"`); bad++; }
}
if (bad) process.exit(1);
console.log(`✓ Student bundle clean (${files.length} files checked).`);
