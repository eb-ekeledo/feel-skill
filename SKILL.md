---
name: feel
description: Turns feel words into exact design values. Use when someone describes how UI should feel rather than what it should look like, such as "make it feel more premium", "calmer", "more tactile", "too jumpy", "feels cheap", "more playful", "quieter". Not for picking colour palettes or brand identity.
---

# Feel

People direct design with adjectives. This skill turns those adjectives into numbers, so "make it calmer" becomes a short, reviewable list of value changes instead of random edits.

## The eight feels

premium, tactile, calm, playful, precise, soft, bold, quiet.

Each one sets 15 values across six dimensions: motion (duration, easing, spring), press, depth (shadow, highlight), shape (radius), type (weight, tracking, scale ratio, contrast) and density (padding). The character, signature moves, do and don't for each feel are in `references/feels/<feel>.md`. Read the file for every feel you use.

## Workflow

1. **Read the request with the engine.** Pass the person's own words:
   ```bash
   node scripts/feel.js --say "the toggle feels flat, make it a bit more tactile"
   ```
   It prints how it read them ("tactile, intensity 1") on stderr, then the values. If it finds no feel words, map them yourself using the table below and run `node scripts/feel.js "<feel> [+ <feel>]" --intensity <1-3>`. If nothing fits, say which feel is closest and ask.
2. **Never invent values.** Every number you write comes from the engine output. The same input always gives the same output.
3. **Show the change table first.** Replace the Baseline column with the values the code actually has today (read them from the file), keep only rows that change, and add one short reason per row from `references/feels/<feel>.md`.
4. **Apply in the code's own idiom** (details in `references/applying.md`):
   - Plain CSS: paste the printed custom properties. They include the dark-mode and reduced-motion blocks; keep both.
   - Tailwind: use `--format tailwind`. Don't convert numbers by hand.
   - Motion / Framer Motion: use `--format motion` (`spring`, `tween`, `whileTap`).
5. **Touch only what the table lists.** Colours, layout and copy stay as they are.

## Word map

| They say | Feel |
| --- | --- |
| expensive, luxurious, refined, high-end, feels cheap | premium |
| clicky, physical, pressable, squishy, satisfying | tactile |
| relaxing, slower, less jumpy, breathe, too busy | calm |
| fun, bouncy, friendly, cheeky, delightful | playful |
| sharp, technical, pro, crisp, exact, tool-like | precise |
| gentle, rounded, pillowy, cosy, warm | soft |
| loud, punchy, confident, graphic, strong | bold |
| subtle, minimal, invisible, gets out of the way | quiet |

"Less X" means move toward the opposite feel: less bouncy = calm or precise, less loud = quiet, less flat = tactile.

## Rules

- Blend at most two feels. Three or more averages into mush; ask which two matter most.
- Dark mode is handled: the CSS output strengthens shadows, halves the highlight and flips text to a light ink at the same contrast step. Don't hand-tune dark values.
- Respect `prefers-reduced-motion`: the CSS output already turns off press scale; keep fades, drop travel.
- The engine keeps every value inside safe bounds (duration 120 to 600 ms, shadow opacity 4% to 24%, text contrast at least AA in light and dark). Don't override the bounds by hand.
- If the person tweaks a value afterwards, keep their value. Their eye wins over the table.
