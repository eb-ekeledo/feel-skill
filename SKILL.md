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

1. **Map the words to feels.** Translate what the person said into one or two of the eight feels. Use the table below. If nothing fits, say which feel is closest and ask.
2. **Pick an intensity.** "a bit", "slightly" = 1. Plain request = 2. "much", "very", "really" = 3.
3. **Get the numbers from the engine. Never invent values.**
   ```bash
   node scripts/feel.js "calm + tactile" --intensity 2
   ```
   It prints a change table, CSS custom properties and a Motion config. The same input always gives the same output.
4. **Show the change table first**, with one short reason per row taken from the feel's reference file. Then edit the code.
5. **Apply to the code in its own idiom:**
   - Plain CSS: add the `--feel-*` custom properties and use them (see `references/applying.md`).
   - Tailwind: use arbitrary values or extend the theme with the same numbers.
   - Motion / Framer Motion: use the printed `spring`, `tween` and `whileTap` objects.
6. **Keep what you didn't touch.** Only change properties the table lists. Colours and layout stay as they are.

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
- Respect `prefers-reduced-motion`: keep fades, drop scale and travel.
- The engine keeps every value inside safe bounds (duration 120 to 600 ms, shadow opacity 4% to 24%, text contrast at least AA). Don't override the bounds by hand.
- If the person tweaks a value afterwards, keep their value. Their eye wins over the table.
