# custom-beam-border

Animated single-color beam border effect for React. A spinning conic gradient masked to a thin border, with glow and pulse — sharp rectangles, fully customizable colors.

## Install

```bash
npm install custom-beam-border
```

## Usage

```tsx
import BeamBorder from "custom-beam-border";

<BeamBorder active={isActive} color="#FF4D6D">
  <img src="/photo.jpg" alt="Photo" />
</BeamBorder>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `active` | `boolean` | `false` | Whether the beam animation is playing |
| `color` | `string` | `"#FF4D6D"` | Primary beam color (hex) |
| `colorLight` | `string` | auto | Lighter accent for the beam center (auto-derived if omitted) |
| `glowColor` | `string` | auto | Glow color as `rgba(...)` string (auto-derived if omitted) |
| `duration` | `number` | `1.8` | Rotation speed in seconds |
| `borderWidth` | `number` | `2` | Beam border thickness in px |
| `className` | `string` | — | Class name for the wrapper |
| `style` | `CSSProperties` | — | Inline styles for the wrapper |
| `onActivate` | `() => void` | — | Fired when beam starts |
| `onDeactivate` | `() => void` | — | Fired when beam finishes (after fade-out) |

## Presets

```tsx
// Crimson Rose — dark mode
<BeamBorder active color="#FF4D6D" colorLight="#FF6B8A" />

// Brass Gold — light mode
<BeamBorder active color="#B8860B" colorLight="#DAA520" />

// Electric Blue
<BeamBorder active color="#0066FF" colorLight="#3388FF" />

// Emerald
<BeamBorder active color="#00C853" colorLight="#69F0AE" />
```

## How it works

1. A **conic gradient** spins behind the content
2. **CSS `mask-composite: exclude`** clips everything except a thin border ring
3. A **box-shadow glow** pulses underneath
4. After ~2.8s the beam fades out over 0.7s

No SVG, no canvas, no JavaScript animation frames — pure CSS transforms and transitions.

## License

MIT
