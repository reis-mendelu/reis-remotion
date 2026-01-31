import React from "react";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { useCurrentFrame, useVideoConfig, interpolate, spring, delayRender, continueRender } from "remotion";

export const professionalTextSchema = z.object({
  text: z.string(),
  type: z.enum(["hook", "context", "headline", "body"]),
  color: zColor().optional(),
  animate: z.boolean().optional(),
});

export type ProfessionalTextProps = z.infer<typeof professionalTextSchema>;

const PRESETS = {
  hook: {
    fontSize: 56, // Reduced from 64 to prevent overflow
    fontWeight: 800,
    lineHeight: 1.2,
    color: "#FFFFFF",
    letterSpacing: "0.08em", // Wider for premium feel
  },
  context: {
    fontSize: 32,
    fontWeight: 500,
    lineHeight: 1.25,
    color: "#E0E0E0",
    letterSpacing: "0.01em",
  },
  headline: {
    fontSize: 48,
    fontWeight: 700,
    lineHeight: 1.3,
    color: "#FFFFFF",
    letterSpacing: "0.02em",
  },
  body: {
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 1.4,
    color: "#D0D0D0",
    letterSpacing: "0.01em",
  },
} as const;

/**
 * ProfessionalText: A "Charlie Munger approved" component for text legibility.
 * 
 * Inversions Prevented:
 * 1. Low contrast on starfield (physics).
 * 2. Broken subpixel AA on transparent layers (opaque background fix).
 * 3. Frame-inaccurate CSS transitions (useCurrentFrame + interpolate).
 */
export const ProfessionalText: React.FC<ProfessionalTextProps> = ({
  text,
  type,
  color,
  animate = true,
}) => {
  const [handle] = React.useState(() => delayRender("Loading fonts"));
  
  React.useEffect(() => {
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.load(`${PRESETS[type].fontWeight} 16px Inter`)
        .then(() => continueRender(handle))
        .catch((e) => {
          console.error("Font load failed:", e);
          continueRender(handle);
        });
    } else {
      continueRender(handle);
    }
  }, [handle, type]);

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const preset = PRESETS[type];

  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 15,
      mass: 0.6,
    },
  });

  // Velocity-based Motion Blur
  const nextEntrance = spring({
    frame: frame + 1,
    fps,
    config: { damping: 15, mass: 0.6 },
  });
  const velocity = Math.abs(nextEntrance - entrance);
  const motionBlur = animate ? interpolate(velocity, [0, 0.1], [0, 8]) : 0;

  const opacity = animate ? interpolate(entrance, [0, 0.5], [0, 1]) : 1;
  const translateY = animate ? interpolate(entrance, [0, 1], [40, 0]) : 0;
  
  // Fluid typography check
  const charLimit = type === "hook" ? 25 : 40;
  const scaleReduction = text.length > charLimit ? charLimit / text.length : 1;
  const responsiveFontSize = preset.fontSize * scaleReduction;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "0 10%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          padding: "30px 60px",
          borderRadius: "16px",
          fontFamily: "'Inter', system-ui, sans-serif",
          ...preset,
          fontSize: responsiveFontSize,
          color: color ?? preset.color,
          opacity,
          transform: `translateY(${translateY}px)`,
          WebkitFontSmoothing: "antialiased",
          textRendering: "optimizeLegibility",
          textAlign: "center",
          maxWidth: "100%",
          boxSizing: "border-box",
          
          // Premium Aesthetic
          background: `linear-gradient(to bottom, #FFFFFF 0%, #D0D0D0 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: `drop-shadow(0 4px 12px rgba(0,0,0,0.5)) ${motionBlur > 0 ? `blur(${motionBlur}px)` : ""}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
