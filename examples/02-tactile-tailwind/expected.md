Feel: tactile (intensity 1)

| Property | Baseline | Feel |
| --- | --- | --- |
| Transition duration | 220ms | 190ms |
| Easing curve | cubic-bezier(0.2, 0, 0, 1) | cubic-bezier(0.25, 0, 0, 1) |
| Spring stiffness | 400 | 500 |
| Spring damping | 32 | 30 |
| Press scale | 0.97 | 0.955 |
| Corner radius | 10px | 12px |
| Shadow blur | 12px | 10px |
| Shadow opacity | 0.1 | 0.14 |
| Top highlight | 0 | 0.25 |
| Font weight | 500 | 550 |
| Text contrast | 0.88 | 0.89 |

```css
:root {
  --feel-duration: 190ms;
  --feel-easing: cubic-bezier(0.25, 0, 0, 1);
  --feel-press: 0.955;
  --feel-radius: 12px;
  --feel-shadow: 0 4px 10px rgba(0, 0, 0, 0.14);
  --feel-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.25);
  --feel-weight: 550;
  --feel-tracking: 0em;
  --feel-ratio: 1.2;
  --feel-ink: 0.89;
  --feel-text: rgb(17 17 17 / 0.89);
  --feel-padding: 16px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --feel-shadow: 0 4px 10px rgba(0, 0, 0, 0.28);
    --feel-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.13);
    --feel-text: rgb(242 242 240 / 0.89);
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
surface: rounded-[12px] p-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_10px_rgba(0,0,0,0.14)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.13),0_4px_10px_rgba(0,0,0,0.28)] transition duration-[190ms] ease-[cubic-bezier(0.25,0,0,1)]
text: font-[550] tracking-[0em] text-[rgb(17_17_17/0.89)] dark:text-[rgb(242_242_240/0.89)]
press: active:scale-[0.955] motion-reduce:transition-none motion-reduce:active:scale-100
```

```js
// Motion / Framer Motion
{
  "spring": {
    "type": "spring",
    "stiffness": 500,
    "damping": 30
  },
  "tween": {
    "duration": 0.19,
    "ease": [
      0.25,
      0,
      0,
      1
    ]
  },
  "whileTap": {
    "scale": 0.955
  }
}
```
