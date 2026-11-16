# Applying the values

The engine prints custom properties. Wire them up once, then a feel change is just new numbers.

## Plain CSS

```css
.card {
  padding: var(--feel-padding);
  border-radius: var(--feel-radius);
  box-shadow: var(--feel-highlight), var(--feel-shadow);
  transition:
    transform var(--feel-duration) var(--feel-easing),
    box-shadow var(--feel-duration) var(--feel-easing);
}
.card h2 {
  font-weight: calc(var(--feel-weight) + 100);
  letter-spacing: var(--feel-tracking);
  font-size: calc(1rem * var(--feel-ratio) * var(--feel-ratio));
}
.card p { color: var(--feel-text); } /* dark text in light mode, light text in dark mode */
.button { font-weight: var(--feel-weight); border-radius: calc(var(--feel-radius) - 4px); }
.button:active { transform: scale(var(--feel-press)); }

@media (prefers-reduced-motion: reduce) {
  .card, .button { transition: opacity var(--feel-duration) linear; }
  .button:active { transform: none; }
}
```

Nested corners: an inner element's radius is the outer radius minus the gap between them. Never larger.

## Tailwind

Use the printed numbers directly:

```html
<div class="rounded-[14px] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
```

Or put the custom properties on `:root` and reference them: `rounded-[var(--feel-radius)]`.

## Motion (Framer Motion)

```js
const feel = { spring: { type: 'spring', stiffness: 260, damping: 30 }, whileTap: { scale: 0.985 } };

<motion.button whileTap={feel.whileTap} transition={feel.spring} />
```

Use the spring for things people touch (press, drag, toggle) and the tween for things that enter, leave or change state on their own.
