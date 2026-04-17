import {
  forwardRef,
  useEffect,
  useState,
  useCallback,
  useId,
  type ReactNode,
  type CSSProperties,
} from "react";

export interface CustomBeamBorderProps {
  children: ReactNode;
  active?: boolean;
  color?: string;
  colorLight?: string;
  glowColor?: string;
  duration?: number;
  borderWidth?: number;
  className?: string;
  style?: CSSProperties;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

const CustomBeamBorder = forwardRef<HTMLDivElement, CustomBeamBorderProps>(
  (
    {
      children,
      active = false,
      color = "#FF4D6D",
      colorLight,
      glowColor,
      duration = 1.8,
      borderWidth = 2,
      className,
      style,
      onActivate,
      onDeactivate,
    },
    ref
  ) => {
    const uid = useId().replace(/:/g, "");
    const [visible, setVisible] = useState(false);
    const [fading, setFading] = useState(false);

    const light = colorLight || lighten(color);
    const glow = glowColor || toGlow(color);

    const onDone = useCallback(() => onDeactivate?.(), [onDeactivate]);

    useEffect(() => {
      if (!active) return;
      setVisible(true);
      setFading(false);
      onActivate?.();
      const t1 = setTimeout(() => setFading(true), 2800);
      const t2 = setTimeout(() => {
        setVisible(false);
        setFading(false);
        onDone();
      }, 3500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [active, onActivate, onDone]);

    const spinName = `cbb-spin-${uid}`;
    const pulseName = `cbb-pulse-${uid}`;

    return (
      <div
        ref={ref}
        className={className}
        style={{ position: "relative", ...style }}
      >
        {children}
        {visible && (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: fading ? 0 : 1,
                transition: "opacity 0.7s ease-out",
                padding: `${borderWidth}px`,
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                mask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude" as never,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "-80%",
                  background: `conic-gradient(from 0deg, transparent 0%, transparent 30%, ${color} 45%, ${light} 50%, ${color} 55%, transparent 70%, transparent 100%)`,
                  animation: `${spinName} ${duration}s linear infinite`,
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                inset: -2,
                pointerEvents: "none",
                boxShadow: `0 0 20px 4px ${glow}, 0 0 50px 8px ${glow.replace(/[\d.]+\)$/, "0.1)")}`,
                opacity: fading ? 0 : 0.8,
                transition: "opacity 0.7s ease-out",
                animation: `${pulseName} 2s ease-in-out infinite`,
              }}
            />
          </>
        )}
        <style>{`
          @keyframes ${spinName} { to { transform: rotate(360deg); } }
          @keyframes ${pulseName} { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        `}</style>
      </div>
    );
  }
);

CustomBeamBorder.displayName = "CustomBeamBorder";

function lighten(hex: string): string {
  const h = hex.replace("#", "");
  const r = Math.min(255, parseInt(h.substring(0, 2), 16) + 30);
  const g = Math.min(255, parseInt(h.substring(2, 4), 16) + 30);
  const b = Math.min(255, parseInt(h.substring(4, 6), 16) + 30);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function toGlow(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, 0.25)`;
}

export default CustomBeamBorder;
