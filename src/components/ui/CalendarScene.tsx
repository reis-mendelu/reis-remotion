import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, interpolate, useVideoConfig } from "remotion";
import { WeeklyCalendar } from "../../components/reis/WeeklyCalendar";

export const CalendarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5 },
  });
  
  const scale = interpolate(entrance, [0, 1], [0.8, 1.6]);
  const opacity = interpolate(entrance, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="flex items-center justify-center" style={{ opacity }}>
      <WeeklyCalendar scale={scale} hideBackground />
    </AbsoluteFill>
  );
};
