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
  colorRgb?: string;
  duration?: number;
  borderWidth?: number;
  glowSize?: number;
  bloomSize?: number;
  bloomOpacity?: number;
  dashRatio?: number;
  fadeInMs?: number;
  holdMs?: number;
  fadeOutMs?: number;
  className?: string;
  style?: CSSProperties;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

const CustomBeamBorder = forwardRef<HTMLDivElement, CustomBeamBorderProps>(
  (
    {
      children,
      active = false,
      color = "#FFBE5C",
      colorRgb,
      duration = 1.8,
      borderWidth = 2,
      glowSize = 20,
      bloomSize = 8,
      bloomOpacity = 0.25,
      dashRatio = 15,
      fadeInMs = 300,
      holdMs = 2400,
      fadeOutMs = 800,
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

    const rgb = colorRgb || hexToRgb(color);

    const onDone = useCallback(() => onDeactivate?.(), [onDeactivate]);

    useEffect(() => {
      if (!active) return;
      setVisible(true);
      setFading(false);
      onActivate?.();
      const t1 = setTimeout(() => setFading(true), fadeInMs + holdMs);
      const t2 = setTimeout(() => {
        setVisible(false);
        setFading(false);
        onDone();
      }, fadeInMs + holdMs + fadeOutMs);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }, [active, fadeInMs, holdMs, fadeOutMs, onActivate, onDone]);

    const travelName = `cbb-travel-${uid}`;
    const pulseName = `cbb-pulse-${uid}`;

    return (
      <div
        ref={ref}
        className={className}
        style={{ position: "relative", ...style }}
      >
        {children}
        {visible && (
          <div
            style={{
              position: "absolute",
              inset: -1,
              pointerEvents: "none",
              opacity: fading ? 0 : 1,
              transition: `opacity ${fadeOutMs}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          >
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "visible",
              }}
            >
              <defs>
                <linearGradient
                  id={`${uid}-grad`}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor={color} stopOpacity="0" />
                  <stop offset="35%" stopColor={color} stopOpacity="0.8" />
                  <stop offset="50%" stopColor={color} stopOpacity="1" />
                  <stop offset="65%" stopColor={color} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
                <filter id={`${uid}-glow`}>
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="3"
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2.5 0"
                    result="glow"
                  />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Main beam */}
              <rect
                x={borderWidth / 2}
                y={borderWidth / 2}
                width="100%"
                height="100%"
                fill="none"
                stroke={`url(#${uid}-grad)`}
                strokeWidth={borderWidth}
                filter={`url(#${uid}-glow)`}
                style={{
                  strokeDasharray: `${dashRatio}% ${100 - dashRatio}%`,
                  animation: `${travelName} ${duration}s linear infinite`,
                }}
              />
              {/* Bloom — wider, blurred duplicate */}
              <rect
                x={-bloomSize / 2}
                y={-bloomSize / 2}
                width={`calc(100% + ${bloomSize}px)`}
                height={`calc(100% + ${bloomSize}px)`}
                fill="none"
                stroke={`rgba(${rgb}, ${bloomOpacity})`}
                strokeWidth={bloomSize}
                style={{
                  strokeDasharray: `${dashRatio + 5}% ${95 - dashRatio}%`,
                  animation: `${travelName} ${duration}s linear infinite`,
                  filter: `blur(${bloomSize * 0.8}px)`,
                }}
              />
            </svg>
            {/* Ambient glow */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                boxShadow: `0 0 ${glowSize}px 3px rgba(${rgb}, 0.2), 0 0 ${glowSize * 2.5}px ${glowSize * 0.4}px rgba(${rgb}, 0.08)`,
                animation: `${pulseName} 2s ease-in-out infinite`,
              }}
            />
            <style>{`
              @keyframes ${travelName} {
                to { stroke-dashoffset: -200%; }
              }
              @keyframes ${pulseName} {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
              }
            `}</style>
          </div>
        )}
      </div>
    );
  }
);

CustomBeamBorder.displayName = "CustomBeamBorder";

export default CustomBeamBorder;
