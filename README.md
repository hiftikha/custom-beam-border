# custom-beam-border

Animated beam border effect for React. A spinning conic gradient masked to a thin border ring, with glow and pulse — pure CSS, fully customizable colors.

Built for [roon.photography](https://roon.photography) where clicking any photo triggers a beam animation as voting feedback.

## Install

```bash
npm install custom-beam-border
```

## Usage

```tsx
import BeamBorder from "custom-beam-border";

function App() {
  const [active, setActive] = useState(false);

  return (
    <BeamBorder
      active={active}
      color="#FF4D6D"
      onDeactivate={() => setActive(false)}
    >
      <img src="/photo.jpg" alt="Photo" />
    </BeamBorder>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `active` | `boolean` | `false` | Whether the beam animation is playing |
| `color` | `string` | `"#FF4D6D"` | Primary beam color |
| `colorLight` | `string` | auto | Lighter accent for the beam center (auto-derived if omitted) |
| `glowColor` | `string` | auto | Glow color as `rgba(...)` (auto-derived if omitted) |
| `duration` | `number` | `1.8` | Rotation speed in seconds |
| `borderWidth` | `number` | `2` | Beam border thickness in px |
| `className` | `string` | — | Class name for the wrapper |
| `style` | `CSSProperties` | — | Inline styles for the wrapper |
| `onActivate` | `() => void` | — | Fired when beam starts |
| `onDeactivate` | `() => void` | — | Fired when beam finishes (after fade-out) |

## Presets

```tsx
// Crimson Rose (dark mode)
<BeamBorder active color="#FF4D6D" colorLight="#FF6B8A" />

// Brass Gold (light mode)
<BeamBorder active color="#B8860B" colorLight="#DAA520" />

// Electric Blue
<BeamBorder active color="#0066FF" colorLight="#3388FF" />

// Emerald
<BeamBorder active color="#00C853" colorLight="#69F0AE" />
```

## Example: Photo voting with HyperFrames video rendering

On [roon.photography](https://roon.photography), clicking a photo in light or dark mode triggers the beam border as vote feedback. You can render this interaction as a video using [HyperFrames](https://github.com/heygen-com/hyperframes):

```html
<!-- composition.html -->
<div
  id="stage"
  data-composition-id="beam-vote-demo"
  data-start="0"
  data-width="1920"
  data-height="1080"
>
  <!-- Dark mode: photo with crimson beam on click -->
  <div
    id="dark-vote"
    class="clip"
    data-start="0"
    data-duration="5"
    data-track-index="0"
    style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: #111;
    "
  >
    <div id="beam-dark" style="width: 600px">
      <img
        src="photo-dark.jpg"
        style="width: 100%; display: block"
      />
    </div>
  </div>

  <!-- Light mode: photo with gold beam on click -->
  <div
    id="light-vote"
    class="clip"
    data-start="5"
    data-duration="5"
    data-track-index="0"
    style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: #f2ece4;
    "
  >
    <div id="beam-light" style="width: 600px">
      <img
        src="photo-light.jpg"
        style="width: 100%; display: block"
      />
    </div>
  </div>
</div>

<script type="module">
  // Frame Adapter: animate the beam border at the click moment
  import BeamBorder from "custom-beam-border";

  // At t=1s, activate dark mode beam (crimson)
  // At t=6s, activate light mode beam (gold)
  document.addEventListener("hyperframes:frame", (e) => {
    const t = e.detail.currentTime;
    if (t >= 1 && t < 4.5) activateBeam("beam-dark", "#FF4D6D");
    if (t >= 6 && t < 9.5) activateBeam("beam-light", "#B8860B");
  });
</script>
```

```bash
npx hyperframes preview   # preview in browser
npx hyperframes render    # render to MP4
```

## How it works

1. A **conic gradient** spins behind the content
2. **CSS `mask-composite: exclude`** clips everything except a thin border ring
3. A **box-shadow glow** pulses underneath
4. After ~2.8s the beam fades out over 0.7s

No SVG, no canvas, no JS animation frames — pure CSS transforms and transitions.

## Credits

Inspired by [`border-beam`](https://github.com/Jakubantalik/border-beam) by Jakub Antalik — an animated border beam effect for React. This library reimplements the concept with a conic-gradient approach, auto-derived colors, and `forwardRef` support.

## License

MIT
