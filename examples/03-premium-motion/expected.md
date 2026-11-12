Feel: premium (intensity 3)

| Property | From | To |
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
  --feel-padding: 22px;
}
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
