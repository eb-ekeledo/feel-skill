#!/usr/bin/env node
/*
 * The correctness checks. Run: node scripts/check.js
 * Exits 1 if anything fails, so it works in CI.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const Feel = require('./engine.js');

const root = path.join(__dirname, '..');
let failures = 0;
let passes = 0;
const fail = (msg) => { failures++; console.log('  FAIL ' + msg); };
const pass = () => { passes++; };

// WCAG contrast of #111 at a given opacity on white.
function contrast(alpha) {
  const c = Math.round(17 * alpha + 255 * (1 - alpha)) / 255;
  const lin = (x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const L = lin(c);
  return (1.05) / (L + 0.05);
}

const names = Object.keys(Feel.FEELS);
const combos = [];
for (const a of names) combos.push([a]);
for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) combos.push([names[i], names[j]]);

console.log('1. Bounds, grid and contrast for ' + combos.length + ' feels and blends at 3 intensities');
for (const combo of combos) {
  for (const intensity of [1, 2, 3]) {
    const { values } = Feel.compute(combo, intensity);
    const id = combo.join('+') + '@' + intensity;
    for (const [key, [lo, hi]] of Object.entries(Feel.BOUNDS)) {
      const v = values[key];
      if (!(v >= lo && v <= hi)) fail(`${id} ${key}=${v} outside ${lo}..${hi}`); else pass();
      const step = Feel.STEP[key];
      const onGrid = Math.abs(v / step - Math.round(v / step)) < 1e-6;
      if (!onGrid) fail(`${id} ${key}=${v} not on the ${step} grid`); else pass();
    }
    const cr = contrast(values.ink);
    if (cr < 4.5) fail(`${id} text contrast ${cr.toFixed(2)} is under AA (4.5)`); else pass();
    const overshoot = values.easing[1] > 1 || values.easing[3] > 1 || values.easing[1] < 0 || values.easing[3] < 0;
    const allowed = combo.includes('playful');
    if (overshoot && !allowed) fail(`${id} easing overshoots without playful`); else pass();
  }
}

console.log('1b. Dark mode keeps AA contrast and sane shadows');
function contrastDark(alpha) {
  const lin = (x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  const mix = (fg, bg) => Math.round(fg * alpha + bg * (1 - alpha)) / 255;
  const L = 0.2126 * lin(mix(242, 18)) + 0.7152 * lin(mix(242, 18)) + 0.0722 * lin(mix(240, 18));
  const B = lin(18 / 255);
  return (L + 0.05) / (B + 0.05);
}
for (const combo of combos) {
  for (const intensity of [1, 2, 3]) {
    const r = Feel.compute(combo, intensity);
    const id = combo.join('+') + '@' + intensity;
    const cr = contrastDark(r.values.ink);
    if (cr < 4.5) fail(`${id} dark text contrast ${cr.toFixed(2)} is under AA`); else pass();
    const d = Feel.darkValues(r.values);
    if (!(d.shadowAlpha >= r.values.shadowAlpha && d.shadowAlpha <= Feel.DARK.shadowMax)) fail(`${id} dark shadow ${d.shadowAlpha} out of range`); else pass();
    const css = Feel.css(r);
    if (!css.includes('prefers-color-scheme: dark') || !css.includes('prefers-reduced-motion: reduce')) fail(`${id} CSS is missing the dark or reduced-motion block`); else pass();
    const tw = Object.values(Feel.tailwind(r)).join(' ');
    for (const needle of [`rounded-[${r.values.radius}px]`, `duration-[${r.values.duration}ms]`, `active:scale-[${r.values.press}]`, `font-[${r.values.weight}]`]) {
      if (!tw.includes(needle)) fail(`${id} Tailwind output is missing ${needle}`); else pass();
    }
  }
}

console.log('1c. Plain words map to the right feels (evals/words.json)');
const words = JSON.parse(fs.readFileSync(path.join(root, 'evals', 'words.json'), 'utf8')).cases;
for (const w of words) {
  const got = Feel.interpret(w.say);
  const same = JSON.stringify([...got.feels].sort()) === JSON.stringify([...w.feels].sort()) && (w.feels.length === 0 || got.intensity === w.intensity);
  if (!same) fail(`"${w.say}" read as ${JSON.stringify(got)}, expected ${JSON.stringify(w.feels)} @${w.intensity}`); else pass();
}

console.log('2. Same input, same output (3 runs each)');
for (const combo of combos) {
  const a = JSON.stringify(Feel.compute(combo, 2));
  for (let i = 0; i < 2; i++) {
    if (JSON.stringify(Feel.compute(combo, 2)) !== a) fail(`${combo.join('+')} changed between runs`); else pass();
  }
}

console.log('3. Blend order does not matter');
for (const combo of combos.filter((c) => c.length === 2)) {
  const ab = JSON.stringify(Feel.compute(combo, 2).values);
  const ba = JSON.stringify(Feel.compute([...combo].reverse(), 2).values);
  if (ab !== ba) fail(`${combo.join('+')} differs from reversed order`); else pass();
}

console.log('4. Every feel has a reference file');
for (const n of names) {
  const f = path.join(root, 'references', 'feels', n + '.md');
  if (!fs.existsSync(f)) fail(`missing references/feels/${n}.md`); else pass();
}

console.log('5. Committed examples match the engine');
const exDir = path.join(root, 'examples');
for (const ex of fs.readdirSync(exDir)) {
  const dir = path.join(exDir, ex);
  const [feel, intensity] = fs.readFileSync(path.join(dir, 'input'), 'utf8').trim().split('|');
  const fresh = execFileSync('node', [path.join(__dirname, 'feel.js'), feel, '--intensity', intensity]).toString();
  const committed = fs.readFileSync(path.join(dir, 'expected.md'), 'utf8');
  if (fresh !== committed) fail(`${ex}: expected.md is out of date (re-run the engine)`); else pass();
  // Every --feel value used in after.* must match the engine.
  const after = fs.readdirSync(dir).find((f) => f.startsWith('after.'));
  const text = fs.readFileSync(path.join(dir, after), 'utf8');
  const v = Feel.compute(feel, Number(intensity)).values;
  const must = [String(v.radius), String(v.duration)];
  if (after.endsWith('.jsx')) must[1] = String(v.duration / 1000);
  for (const m of must) {
    if (!text.includes(m)) fail(`${ex}/${after} does not use engine value ${m}`); else pass();
  }
}

console.log(`\n${passes} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
