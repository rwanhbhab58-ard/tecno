// One-time fix: legacy articles used "#" as a section heading after the intro,
// which would produce several <h1> per page. Between the first body-level "#"
// and the FAQ/sources sections, every heading is demoted one level so the
// article title stays the only H1 and the outline has no skipped levels.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'src/content/articles';
const STOP = /^## (الأسئلة الشائعة|المصادر والمراجع)\s*$/;

for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const lines = readFileSync(join(dir, file), 'utf8').split('\n');
  let inFence = false;
  let demote = false;
  let fmDashes = 0;
  let changed = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (fmDashes < 2) {
      if (line === '---') fmDashes++;
      continue;
    }
    if (/^(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    if (STOP.test(line)) demote = false;
    else if (/^# /.test(line)) demote = true;
    if (demote && /^#{1,5} /.test(line)) {
      lines[i] = `#${line}`;
      changed++;
    }
  }
  writeFileSync(join(dir, file), lines.join('\n'));
  console.log(`${file}: ${changed} headings demoted`);
}
