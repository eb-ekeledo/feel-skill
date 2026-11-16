Feel: calm (intensity 2)

| Property | Baseline | Feel |
| --- | --- | --- |
| Transition duration | 220ms | 420ms |
| Easing curve | cubic-bezier(0.2, 0, 0, 1) | cubic-bezier(0.4, 0, 0.2, 1) |
| Spring stiffness | 400 | 180 |
| Spring damping | 32 | 26 |
| Press scale | 0.97 | 0.99 |
| Corner radius | 10px | 16px |
| Shadow offset | 4px | 8px |
| Shadow blur | 12px | 24px |
| Shadow opacity | 0.1 | 0.06 |
| Top highlight | 0 | 0.04 |
| Font weight | 500 | 450 |
| Letter spacing | 0em | 0.005em |
| Type scale ratio | 1.2 | 1.15 |
| Text contrast | 0.88 | 0.78 |
| Base padding | 16px | 22px |

```css
:root {
  --feel-duration: 420ms;
  --feel-easing: cubic-bezier(0.4, 0, 0.2, 1);
  --feel-press: 0.99;
  --feel-radius: 16px;
  --feel-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  --feel-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  --feel-weight: 450;
  --feel-tracking: 0.005em;
  --feel-ratio: 1.15;
  --feel-ink: 0.78;
  --feel-text: rgb(17 17 17 / 0.78);
  --feel-padding: 22px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --feel-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    --feel-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.02);
    --feel-text: rgb(242 242 240 / 0.78);
  }
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --feel-press: 1;
    --feel-easing: linear;
  }
}
```

```txt
// Tailwind
surface: rounded-[16px] p-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02),0_8px_24px_rgba(0,0,0,0.12)] transition duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)]
text: font-[450] tracking-[0.005em] text-[rgb(17_17_17/0.78)] dark:text-[rgb(242_242_240/0.78)]
press: active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100
```

```js
// Motion / Framer Motion
{
  "spring": {
    "type": "spring",
    "stiffness": 180,
    "damping": 26
  },
  "tween": {
    "duration": 0.42,
    "ease": [
      0.4,
      0,
      0.2,
      1
    ]
  },
  "whileTap": {
    "scale": 0.99
  }
}
```
