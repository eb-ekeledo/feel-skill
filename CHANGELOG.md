# Changelog

## 2.0.0 (2026-11-16)

- `--say "<sentence>"`: the engine reads feel words from a plain sentence, including problems ("feels cheap", "too jumpy"), "less X" and intensity words ("a bit", "very"). Same sentence, same reading, every time. The model no longer does the mapping by eye.
- CSS output now includes `--feel-text`, a `prefers-color-scheme: dark` block (stronger shadows, half highlight, light text at the same contrast step) and a `prefers-reduced-motion` block (no press scale, linear easing).
- `--format tailwind`: ready-made class strings with `dark:` and `motion-reduce:` variants. No hand conversion.
- Change tables now say Baseline and Feel; the skill swaps Baseline for the values your code has today.
- Checks: AA contrast in dark mode, dark shadow bounds, both media blocks present, Tailwind matches the engine, 12 sentence-reading cases (`evals/words.json`).
- Fix: `--intensity` now wins over the intensity read from a sentence.

## 0.1.0 (2026-11-12)

- First release: 8 feels, blending, 3 intensities, engine CLI, demo page, 3 examples, checks.
