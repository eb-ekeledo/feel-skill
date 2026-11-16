Feel: premium (intensity 3)

| Property | Baseline | Feel |
| --- | --- | --- |
| Transition duration | 220ms | 370ms |
| Easing curve | cubic-bezier(0.2, 0, 0, 1) | cubic-bezier(0.14, 1, 0.45, 1) |
| Spring stiffness | 400 | 190 |
| Spring damping | 32 | 29 |
| Press scale | 0.97 | 0.99 |
| Corner radius | 10px | 16px |
| Shadow offset | 4px | 16px |
| Shadow blur | 12px | 42px |
| Shadow opacity | 0.1 | 0.13 |
| Top highlight | 0 | 0.09 |
| Letter spacing | 0em | -0.015em |
| Type scale ratio | 1.2 | 1.275 |
| Text contrast | 0.88 | 0.94 |
| Base padding | 16px | 22px |

```css
:root {
  --feel-duration: 370ms;
  --feel-easing: cubic-bezier(0.14, 1, 0.45, 1);
  --feel-press: 0.99;
  --feel-radius: 16px;
  --feel-shadow: 0 16px 42px rgba(0, 0, 0, 0.13);
  --feel-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.09);
  --feel-weight: 500;
  --feel-tracking: -0.015em;
  --feel-ratio: 1.275;
  --feel-ink: 0.94;
  --feel-text: rgb(17 17 17 / 0.94);
  --feel-padding: 22px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --feel-shadow: 0 16px 42px rgba(0, 0, 0, 0.26);
    --feel-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    --feel-text: rgb(242 242 240 / 0.94);
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
surface: rounded-[16px] p-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_16px_42px_rgba(0,0,0,0.13)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_16px_42px_rgba(0,0,0,0.26)] transition duration-[370ms] ease-[cubic-bezier(0.14,1,0.45,1)]
text: font-[500] tracking-[-0.015em] text-[rgb(17_17_17/0.94)] dark:text-[rgb(242_242_240/0.94)]
press: active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100
```

```js
// Motion / Framer Motion
{
  "spring": {
    "type": "spring",
    "stiffness": 190,
    "damping": 29
  },
  "tween": {
    "duration": 0.37,
    "ease": [
      0.14,
      1,
      0.45,
      1
    ]
  },
  "whileTap": {
    "scale": 0.99
  }
}
```
