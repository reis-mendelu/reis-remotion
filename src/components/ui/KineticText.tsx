import React from 'react';
import { 
  AbsoluteFill, 
  interpolate, 
  spring, 
  useCurrentFrame, 
  useVideoConfig 
} from 'remotion';

interface KineticTextProps {
  text: string;
  fontSize?: number;
  className?: string;
  themeColor?: string;
}

export const KineticText: React.FC<KineticTextProps> = ({ 
  text, 
  fontSize = 80, 
  className = "",
  themeColor = "#79BE15"
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <AbsoluteFill className={`flex flex-col items-center justify-center pointer-events-none ${className}`}>
      <div className="flex flex-wrap justify-center gap-x-4 px-20">
        {words.map((word, i) => {
          // Stagger the entrance of each word
          const delay = i * 3;
          const entrance = spring({
            frame: frame - delay,
            fps,
            config: {
              damping: 12,
              mass: 0.5,
              stiffness: 100,
            },
          });

          // Animate from below and transparent to position and opaque
          const translateY = interpolate(entrance, [0, 1], [50, 0]);
          const opacity = interpolate(entrance, [0, 1], [0, 1]);
          const scale = interpolate(entrance, [0, 1], [0.8, 1]);

          return (
            <span
              key={i}
              className="inline-block font-black uppercase italic tracking-tighter"
              style={{
                fontSize: `${fontSize}px`,
                color: 'white',
                textShadow: `0 10px 30px ${themeColor}66, 0 0 10px rgba(0,0,0,0.5)`,
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity,
                lineHeight: 1.1,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
