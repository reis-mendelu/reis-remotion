import React, { useMemo } from "react";
import { AbsoluteFill, Img, Video, staticFile, useCurrentFrame } from "remotion";
import { BackgroundProps } from "./schema";
import { Stars } from "./Stars";

export const Background: React.FC<BackgroundProps> = (props) => {
  const frame = useCurrentFrame();
  
  // Resolve Props from Preset
  const resolved = useMemo((): BackgroundProps => {
    const { preset } = props;
    if (preset === "mendelu-green") {
      return { type: "gradient", gradientType: "linear", gradientColors: ["#79be15", "#A0D25A"], gradientAngle: 135 };
    }
    if (preset === "mendelu-dark") {
      return { type: "mesh", meshColors: ["#0f1113", "#1e2329", "#79be15", "#0a5028"] };
    }
    if (preset === "pef-blue") {
      return { type: "mesh", meshColors: ["#0046a0", "#002a60", "#00aab4", "#0a5028"] };
    }
    return props;
  }, [props]);

  const { 
    type = "solid", 
    color, 
    gradientType = "linear", 
    gradientColors, 
    gradientAngle = 180, 
    meshColors, 
    src,
    starsCount
  } = resolved;

  const style = useMemo(() => {
    if (type === "solid") {
      return { backgroundColor: color || "#ffffff" };
    }
    if (type === "gradient") {
      const colors = (gradientColors || ["#ffffff", "#000000"]).join(", ");
      if (gradientType === "radial") {
        return { background: `radial-gradient(circle, ${colors})` };
      }
      return { background: `linear-gradient(${gradientAngle ?? 180}deg, ${colors})` };
    }
    return {};
  }, [type, color, gradientType, gradientColors, gradientAngle]);

  if (type === "mesh" && meshColors) {
    // Mesh gradients are simulated with multiple moving radial gradients
    // This is "purer" than CSS transitions and stays deterministic.
    return (
      <AbsoluteFill style={{ backgroundColor: meshColors[0] || "#000", overflow: "hidden" }}>
        {meshColors.slice(1).map((c, i) => {
          const moveX = Math.sin((frame / 60) + i) * 20 + 50;
          const moveY = Math.cos((frame / 90) + i) * 20 + 50;
          const size = 60 + Math.sin(frame / 120 + i) * 10;
          
          return (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                width: `${size}%`,
                height: `${size}%`,
                left: `${moveX}%`,
                top: `${moveY}%`,
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle, ${c} 0%, transparent 70%)`,
                opacity: 0.4,
                mixBlendMode: "screen",
              }}
            />
          );
        })}
        {/* Grain Overlay for professional look */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none mix-blend-overlay">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </AbsoluteFill>
    );
  }

  if (type === "image" && src) {
    const imageSrc = src.startsWith("http") ? src : staticFile(src);
    return (
      <AbsoluteFill>
        <Img src={imageSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    );
  }

  if (type === "video" && src) {
    const videoSrc = src.startsWith("http") ? src : staticFile(src);
    return (
      <AbsoluteFill>
        <Video src={videoSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    );
  }

  if (type === "stars") {
    return <Stars starsCount={starsCount} />;
  }

  return <AbsoluteFill style={style} />;
};
