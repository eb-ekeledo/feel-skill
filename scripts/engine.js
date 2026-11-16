/*
 * feel-skill engine: the single source of truth for every number.
 * Works in Node (require) and in the browser (window.Feel).
 * Same input always gives the same output: no randomness, no model guesses.
 */
(function (root) {
  'use strict';

  // The neutral baseline every feel is measured against.
  const NEUTRAL = {
    duration: 220,          // ms, UI transitions
    easing: [0.2, 0, 0, 1], // cubic-bezier control points
    stiffness: 400,         // spring (Motion / Framer Motion)
    damping: 32,
    press: 0.97,            // scale while pressed
    radius: 10,             // px
    shadowY: 4, shadowBlur: 12, shadowAlpha: 0.10,
    highlight: 0.0,         // inset top highlight opacity
    weight: 500,            // body / label weight
    tracking: 0,            // em
    ratio: 1.2,             // type scale step
    ink: 0.88,              // text opacity on the surface
    padding: 16,            // px, base inset
  };

  // Intensity 2 values for each feel. Every value has a reason in references/feels/<feel>.md
  const FEELS = {
    premium: { duration: 320, easing: [0.16, 1, 0.3, 1], stiffness: 260, damping: 30, press: 0.985, radius: 14, shadowY: 12, shadowBlur: 32, shadowAlpha: 0.12, highlight: 0.06, weight: 500, tracking: -0.01, ratio: 1.25, ink: 0.92, padding: 20 },
    tactile: { duration: 160, easing: [0.3, 0, 0, 1], stiffness: 600, damping: 28, press: 0.94, radius: 12, shadowY: 3, shadowBlur: 6, shadowAlpha: 0.18, highlight: 0.5, weight: 600, tracking: 0, ratio: 1.2, ink: 0.9, padding: 16 },
    calm:    { duration: 420, easing: [0.4, 0, 0.2, 1], stiffness: 180, damping: 26, press: 0.99, radius: 16, shadowY: 8, shadowBlur: 24, shadowAlpha: 0.06, highlight: 0.04, weight: 450, tracking: 0.005, ratio: 1.15, ink: 0.78, padding: 22 },
    playful: { duration: 280, easing: [0.34, 1.56, 0.64, 1], stiffness: 500, damping: 14, press: 0.92, radius: 20, shadowY: 6, shadowBlur: 14, shadowAlpha: 0.14, highlight: 0.2, weight: 650, tracking: -0.005, ratio: 1.3, ink: 0.92, padding: 18 },
    precise: { duration: 140, easing: [0.2, 0, 0, 1], stiffness: 700, damping: 45, press: 0.98, radius: 4, shadowY: 1, shadowBlur: 2, shadowAlpha: 0.08, highlight: 0, weight: 500, tracking: 0, ratio: 1.125, ink: 0.95, padding: 12 },
    soft:    { duration: 360, easing: [0.25, 0.1, 0.25, 1], stiffness: 220, damping: 22, press: 0.97, radius: 22, shadowY: 10, shadowBlur: 30, shadowAlpha: 0.08, highlight: 0.15, weight: 450, tracking: 0.01, ratio: 1.2, ink: 0.8, padding: 20 },
    bold:    { duration: 200, easing: [0.7, 0, 0.2, 1], stiffness: 650, damping: 30, press: 0.95, radius: 6, shadowY: 6, shadowBlur: 16, shadowAlpha: 0.2, highlight: 0, weight: 750, tracking: -0.025, ratio: 1.4, ink: 1.0, padding: 18 },
    quiet:   { duration: 260, easing: [0.4, 0, 0.2, 1], stiffness: 260, damping: 34, press: 0.99, radius: 8, shadowY: 2, shadowBlur: 8, shadowAlpha: 0.04, highlight: 0, weight: 400, tracking: 0.01, ratio: 1.125, ink: 0.7, padding: 16 },
  };

  // Hard limits. Nothing the engine returns may sit outside these.
  const BOUNDS = {
    duration: [120, 600], stiffness: [100, 800], damping: [10, 50], press: [0.9, 1],
    radius: [0, 28], shadowY: [0, 24], shadowBlur: [0, 48], shadowAlpha: [0.04, 0.24],
    highlight: [0, 0.6], weight: [400, 800], tracking: [-0.03, 0.03], ratio: [1.067, 1.5],
    ink: [0.6, 1], padding: [8, 32],
  };

  // How far from neutral each intensity goes.
  const INTENSITY = { 1: 0.5, 2: 1, 3: 1.5 };

  // Rounding steps, so outputs land on a grid people can reason about.
  const STEP = {
    duration: 10, stiffness: 10, damping: 1, press: 0.005, radius: 2, shadowY: 1, shadowBlur: 2,
    shadowAlpha: 0.01, highlight: 0.01, weight: 50, tracking: 0.005, ratio: 0.005, ink: 0.01, padding: 2,
  };

  const UNITS = { duration: 'ms', radius: 'px', shadowY: 'px', shadowBlur: 'px', tracking: 'em', padding: 'px' };

  const LABELS = {
    duration: 'Transition duration', easing: 'Easing curve', stiffness: 'Spring stiffness', damping: 'Spring damping',
    press: 'Press scale', radius: 'Corner radius', shadowY: 'Shadow offset', shadowBlur: 'Shadow blur',
    shadowAlpha: 'Shadow opacity', highlight: 'Top highlight', weight: 'Font weight', tracking: 'Letter spacing',
    ratio: 'Type scale ratio', ink: 'Text contrast', padding: 'Base padding',
  };

  // Plain words to feels. "less X" moves toward the listed opposite.
  const WORDS = {
    premium: ['premium', 'expensive', 'luxurious', 'luxury', 'refined', 'high-end', 'high end', 'classy', 'elegant', 'cheap'],
    tactile: ['tactile', 'clicky', 'physical', 'pressable', 'squishy', 'satisfying', 'flat', 'touchable'],
    calm: ['calm', 'calmer', 'relaxing', 'relaxed', 'slower', 'jumpy', 'breathe', 'busy', 'frantic', 'chill'],
    playful: ['playful', 'fun', 'bouncy', 'friendly', 'cheeky', 'delightful', 'joyful', 'boring'],
    precise: ['precise', 'sharp', 'technical', 'pro', 'crisp', 'exact', 'tool-like', 'snappy', 'sloppy'],
    soft: ['soft', 'softer', 'gentle', 'rounded', 'rounder', 'pillowy', 'cosy', 'cozy', 'warm', 'harsh'],
    bold: ['bold', 'bolder', 'loud', 'punchy', 'confident', 'graphic', 'strong', 'timid', 'weak'],
    quiet: ['quiet', 'quieter', 'subtle', 'minimal', 'invisible', 'understated', 'noisy', 'shouty'],
  };
  // Words that describe the problem ("feels cheap", "too jumpy") map to the cure listed above;
  // "less X" maps to the opposite feel.
  const OPPOSITE = { premium: 'quiet', tactile: 'quiet', calm: 'bold', playful: 'precise', precise: 'soft', soft: 'precise', bold: 'quiet', quiet: 'bold' };
  const LESS_BOUNCY = { bouncy: 'calm', loud: 'quiet', flat: 'tactile', busy: 'calm', jumpy: 'calm', round: 'precise', rounded: 'precise', sharp: 'soft', heavy: 'quiet' };

  function interpret(sentence) {
    const text = ' ' + String(sentence).toLowerCase().replace(/[^a-z\s-]/g, ' ').replace(/\s+/g, ' ') + ' ';
    const found = [];
    const add = (f) => { if (!found.includes(f)) found.push(f); };
    // "less X" / "not so X" / "too X" first
    const lessRe = /(?:less|not so|not as|too)\s+([a-z-]+)/g;
    let m;
    const consumed = new Set();
    while ((m = lessRe.exec(text))) {
      const w = m[1];
      consumed.add(w);
      if (LESS_BOUNCY[w]) { add(LESS_BOUNCY[w]); continue; }
      const feel = Object.keys(WORDS).find((f) => WORDS[f].includes(w));
      if (feel) add(m[0].startsWith('too') && ['jumpy', 'busy', 'frantic', 'harsh', 'noisy', 'shouty', 'sloppy', 'boring', 'timid', 'weak', 'flat', 'cheap'].includes(w) ? feel : OPPOSITE[feel]);
    }
    for (const [feel, list] of Object.entries(WORDS)) {
      for (const w of list) {
        if (consumed.has(w)) continue;
        if (text.includes(' ' + w + ' ')) add(feel);
      }
    }
    let intensity = 2;
    if (/\b(a bit|a little|slightly|a touch|somewhat|bit more|little more)\b/.test(text)) intensity = 1;
    if (/\b(very|really|much|way|super|extremely|a lot|so much|lot more|much more)\b/.test(text)) intensity = 3;
    return { feels: found.slice(0, 2), intensity, dropped: found.slice(2) };
  }

  const round = (v, s) => Math.round(Math.round(v / s) * s * 1e6) / 1e6;
  const clamp = (v, [lo, hi]) => Math.min(hi, Math.max(lo, v));
  const r3 = (v) => Math.round(v * 1000) / 1000;

  function parse(input) {
    // "calm + tactile", "calm+tactile", ["calm","tactile"]
    const names = (Array.isArray(input) ? input : String(input).split(/[+,&]|\band\b/))
      .map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (!names.length) throw new Error('Name at least one feel: ' + Object.keys(FEELS).join(', '));
    for (const n of names) {
      if (!FEELS[n]) throw new Error('Unknown feel "' + n + '". Known feels: ' + Object.keys(FEELS).join(', '));
    }
    return [...new Set(names)];
  }

  /** Blend the named feels at an intensity (1, 2 or 3). Returns resolved values. */
  function compute(input, intensity = 2) {
    const names = parse(input);
    const k = INTENSITY[intensity];
    if (k === undefined) throw new Error('Intensity must be 1, 2 or 3');
    const out = {};
    for (const key of Object.keys(NEUTRAL)) {
      if (key === 'easing') {
        // Average control points, then push away from neutral by k. Overshoot is allowed on y only.
        const avg = [0, 1, 2, 3].map((i) => names.reduce((s, n) => s + FEELS[n].easing[i], 0) / names.length);
        // Overshoot (y outside 0..1) only when a feel in the blend asks for it, like playful.
        const overshoot = names.some((n) => FEELS[n].easing[1] > 1 || FEELS[n].easing[3] > 1);
        out.easing = avg.map((v, i) => {
          const x = NEUTRAL.easing[i] + (v - NEUTRAL.easing[i]) * k;
          if (i % 2 === 0) return r3(clamp(x, [0, 1]));
          return r3(overshoot ? clamp(x, [-0.5, 1.8]) : clamp(x, [0, 1]));
        });
        continue;
      }
      const avg = names.reduce((s, n) => s + FEELS[n][key], 0) / names.length;
      const pushed = NEUTRAL[key] + (avg - NEUTRAL[key]) * k;
      out[key] = clamp(round(pushed, STEP[key]), BOUNDS[key]);
    }
    return { feels: names, intensity, values: out };
  }

  function fmt(key, v) {
    if (key === 'easing') return 'cubic-bezier(' + v.join(', ') + ')';
    return v + (UNITS[key] || '');
  }

  /** The change table Claude shows: property, from (neutral), to, and the dimension. */
  function table(result) {
    const rows = Object.keys(NEUTRAL).map((key) => ({
      key, label: LABELS[key], from: fmt(key, NEUTRAL[key]), to: fmt(key, result.values[key]),
    }));
    return rows;
  }

  // Dark surfaces swallow shadows, so they get stronger; text flips to a light ink at the same contrast step.
  const DARK = { surface: '#121212', ink: [242, 242, 240], shadowBoost: 2, shadowMax: 0.48 };

  function darkValues(v) {
    return {
      shadowAlpha: Math.min(DARK.shadowMax, round(v.shadowAlpha * DARK.shadowBoost, 0.01)),
      highlight: round(v.highlight * 0.5, 0.01), // a white highlight reads twice as bright on dark
    };
  }

  function css(result, selector = ':root', opts = {}) {
    const v = result.values;
    const d = darkValues(v);
    const lines = [
      '--feel-duration: ' + v.duration + 'ms;',
      '--feel-easing: ' + fmt('easing', v.easing) + ';',
      '--feel-press: ' + v.press + ';',
      '--feel-radius: ' + v.radius + 'px;',
      '--feel-shadow: 0 ' + v.shadowY + 'px ' + v.shadowBlur + 'px rgba(0, 0, 0, ' + v.shadowAlpha + ');',
      '--feel-highlight: inset 0 1px 0 rgba(255, 255, 255, ' + v.highlight + ');',
      '--feel-weight: ' + v.weight + ';',
      '--feel-tracking: ' + v.tracking + 'em;',
      '--feel-ratio: ' + v.ratio + ';',
      '--feel-ink: ' + v.ink + ';',
      '--feel-text: rgb(17 17 17 / ' + v.ink + ');',
      '--feel-padding: ' + v.padding + 'px;',
    ];
    let out = selector + ' {\n  ' + lines.join('\n  ') + '\n}';
    if (opts.full !== false) {
      out += '\n\n@media (prefers-color-scheme: dark) {\n  ' + selector + ' {\n' +
        '    --feel-shadow: 0 ' + v.shadowY + 'px ' + v.shadowBlur + 'px rgba(0, 0, 0, ' + d.shadowAlpha + ');\n' +
        '    --feel-highlight: inset 0 1px 0 rgba(255, 255, 255, ' + d.highlight + ');\n' +
        '    --feel-text: rgb(' + DARK.ink.join(' ') + ' / ' + v.ink + ');\n  }\n}' +
        '\n\n@media (prefers-reduced-motion: reduce) {\n  ' + selector + ' {\n' +
        '    --feel-press: 1;\n    --feel-easing: linear;\n  }\n}';
    }
    return out;
  }

  /** Tailwind arbitrary-value classes, so nobody converts numbers by hand. */
  function tailwind(result) {
    const v = result.values;
    const d = darkValues(v);
    const e = v.easing.join(',');
    return {
      surface: [
        'rounded-[' + v.radius + 'px]', 'p-[' + v.padding + 'px]',
        'shadow-[inset_0_1px_0_rgba(255,255,255,' + v.highlight + '),0_' + v.shadowY + 'px_' + v.shadowBlur + 'px_rgba(0,0,0,' + v.shadowAlpha + ')]',
        'dark:shadow-[inset_0_1px_0_rgba(255,255,255,' + d.highlight + '),0_' + v.shadowY + 'px_' + v.shadowBlur + 'px_rgba(0,0,0,' + d.shadowAlpha + ')]',
        'transition', 'duration-[' + v.duration + 'ms]', 'ease-[cubic-bezier(' + e + ')]',
      ].join(' '),
      text: ['font-[' + v.weight + ']', 'tracking-[' + v.tracking + 'em]', 'text-[rgb(17_17_17/' + v.ink + ')]', 'dark:text-[rgb(242_242_240/' + v.ink + ')]'].join(' '),
      press: ['active:scale-[' + v.press + ']', 'motion-reduce:transition-none', 'motion-reduce:active:scale-100'].join(' '),
    };
  }

  function motion(result) {
    const v = result.values;
    return {
      spring: { type: 'spring', stiffness: v.stiffness, damping: v.damping },
      tween: { duration: v.duration / 1000, ease: v.easing },
      whileTap: { scale: v.press },
    };
  }

  const api = { NEUTRAL, FEELS, BOUNDS, STEP, INTENSITY, LABELS, WORDS, DARK, compute, table, css, tailwind, motion, fmt, parse, interpret, darkValues };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Feel = api;
})(typeof window !== 'undefined' ? window : globalThis);
