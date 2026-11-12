#!/usr/bin/env node
/*
 * Usage:
 *   node scripts/feel.js "calm + tactile"            # change table, CSS and Motion config
 *   node scripts/feel.js premium --intensity 3       # 1 = a bit, 2 = default, 3 = very
 *   node scripts/feel.js playful --format css|motion|json|table
 *   node scripts/feel.js --list
 */
const Feel = require('./engine.js');

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf('--' + name);
  if (i === -1) return fallback;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const intensity = Number(opt('intensity', 2));
const format = opt('format', 'all');

if (args.includes('--list')) {
  console.log(Object.keys(Feel.FEELS).join('\n'));
  process.exit(0);
}

const input = args.join(' ');
if (!input) {
  console.error('Name a feel, for example: node scripts/feel.js "calm + tactile"');
  process.exit(1);
}

let result;
try {
  result = Feel.compute(input, intensity);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

const tableMd = () => {
  const rows = Feel.table(result).filter((r) => r.from !== r.to);
  return [
    '| Property | From | To |',
    '| --- | --- | --- |',
    ...rows.map((r) => `| ${r.label} | ${r.from} | ${r.to} |`),
  ].join('\n');
};

const title = `Feel: ${result.feels.join(' + ')} (intensity ${result.intensity})`;
const out = {
  table: () => tableMd(),
  css: () => Feel.css(result),
  motion: () => JSON.stringify(Feel.motion(result), null, 2),
  json: () => JSON.stringify(result, null, 2),
  all: () => [title, '', tableMd(), '', '```css', Feel.css(result), '```', '', '```js', '// Motion / Framer Motion', JSON.stringify(Feel.motion(result), null, 2), '```'].join('\n'),
};
if (!out[format]) {
  console.error('Unknown format. Use table, css, motion, json or all.');
  process.exit(1);
}
console.log(out[format]());
