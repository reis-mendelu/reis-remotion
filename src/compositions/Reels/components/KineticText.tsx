import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface KineticTextProps {
  text: string;
  startFrame: number;
  duration?: number;
  fontSize?: number;
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  startFrame,
  duration = 40,
  fontSize = 72,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - startFrame;
  if (localFrame < 0 || localFrame > duration) return null;

  const entrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, mass: 0.4 },
  });

  const exit = localFrame > duration - 10
    ? interpolate(localFrame, [duration - 10, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const y = interpolate(entrance, [0, 1], [20, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: "15%",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 100,
        opacity: entrance * exit,
        transform: `scale(${scale}) translateY(${y}px)`,
      }}
    >
      <div
        style={{
          color: "#ffffff",
          fontSize,
          fontWeight: 900,
          fontFamily: "Inter, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          textShadow: "0 4px 20px rgba(0,0,0,0.6)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
