# Evals

Three layers. A release ships only when all three pass.

| Layer | Question | How | Status |
| --- | --- | --- | --- |
| 1. Trigger | Does Claude load the skill at the right time? | `triggers.json`: 10 prompts that should load it, 10 that shouldn't. Target 9 of 10 each side. | Prompt set written, not yet scored |
| 2. Correctness | Are the numbers right? | `node scripts/check.js`: bounds, grid, AA contrast, no overshoot outside playful, determinism, blend order, examples match the engine. | Passing (3,357 checks) |
| 3. Better than nothing | Is the output better than Claude without the skill? | 5 tasks, with and without the skill, 3 runs each, screenshots shuffled and judged blind by designers. Ship rule: with-skill wins 7 of 10 picks. | Not yet run |

## Taste tests

Polish is the point of this repo, so on top of the layers:

- **Almost-right pairs.** Pairs of the same card where one value is slightly off (radius, shadow, timing). With the skill, Claude should pick the better one and fix the other.
- **Next to the best.** The demo page sits next to reference work. If it looks out of place, it isn't done.
- **Taste log.** Every rejected output and the reason becomes a new pair.

Results are logged in `RESULTS.md` when a layer is run.
