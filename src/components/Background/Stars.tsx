import React, { useMemo } from "react";
import { AbsoluteFill, random, interpolate, useCurrentFrame } from "remotion";

export const Stars: React.FC<{ starsCount?: number }> = ({ starsCount = 200 }) => {
  const frame = useCurrentFrame();

  const stars = useMemo(() => {
    return Array.from({ length: starsCount }).map((_, i) => {
      const posX = random(`starX${i}`) * 100;
      const posY = random(`starY${i}`) * 100;
      
      // Distribution: mostly small, some medium, very few large
      const r = random(`starSize${i}`);
      let size;
      if (r > 0.98) {
        size = 3 + random(`starSizeLarge${i}`) * 1.5; // 3px - 4.5px
      } else if (r > 0.9) {
        size = 1.5 + random(`starSizeMedium${i}`) * 1.5; // 1.5px - 3px
      } else {
        size = 0.5 + random(`starSizeSmall${i}`) * 1; // 0.5px - 1.5px
      }
      
      const offset = random(`starOffset${i}`) * 100;
      return { posX, posY, size, offset };
    });
  }, [starsCount]);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {stars.map((star, i) => {
        const opacity = interpolate(
          Math.sin((frame + star.offset) * 0.05),
          [-1, 1],
          [0.2, 1], // Minimum opacity so they don't disappear completely
          { extrapolateRight: "clamp" }
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${star.posX}%`,
              top: `${star.posY}%`,
              width: star.size,
              height: star.size,
              backgroundColor: "white",
              borderRadius: "50%",
              opacity,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${opacity * 0.8})` // Add a little glow
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
