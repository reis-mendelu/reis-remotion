import React from "react";
import { spring, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { Calendar } from "lucide-react";

interface ToggleProps {
  enabled: boolean | null;
  loading: boolean;
  showInfo: boolean;
  progress: number;
}

export const VideoOutlookSyncToggle: React.FC<ToggleProps> = ({ enabled, loading, progress }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  
  // Munger-style Softer Spring for slower, more deliberate motion
  const springProgress = spring({
    frame: progress * 60, 
    fps,
    config: {
      damping: 25,
      stiffness: 80, // Reduced from 200 for "slowly" requirement
    },
  });

  // Loading state pulse - perfectly deterministic
  const loadingPulse = loading 
    ? interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.8, 1])
    : 1;

  const toggleX = interpolate(springProgress, [0, 1], [4, 14]);
  
  // Smooth color transition using interpolateColors
  const background = interpolateColors(
    springProgress,
    [0, 1],
    ["#1f2937", "#79be15"] // base-100 dark to primary
  );

  // Glow intensity driven by spring progress
  const glowOpacity = interpolate(springProgress, [0.8, 1], [0, 0.4], { extrapolateLeft: "clamp" });

  return (
    <div 
      className="flex items-center justify-between gap-3 px-1 py-2 rounded-lg hover:bg-base-200 w-full relative"
    >
        <div className="flex items-center gap-2 flex-1">
          <Calendar 
            size={16} 
            strokeWidth={1.5} 
            className="text-[#9ca3af]"
            style={{ 
              opacity: interpolate(springProgress, [0, 1], [0.4, 0.8]),
              transform: `scale(${interpolate(springProgress, [0, 1], [1, 1.1])})`,
            }} 
          />
          <span className="text-xs font-bold text-[#f3f4f6]" style={{ opacity: interpolate(springProgress, [0, 1], [0.5, 0.8]) }}>
            Synchronizace rozvrhu
          </span>
        </div>
        <div className="relative flex items-center gap-3">
          {/* Info section disabled/hidden as per request */}
          
          <div 
            className="w-8 h-5 rounded-full relative overflow-visible border border-base-content/10 shadow-inner"
            style={{
              backgroundColor: enabled ? background : "#374151", // base-300 dark
              opacity: loading ? 0.7 : 1,
            }}
          >
            {/* Bloom/Glow effect */}
            <div 
              className="absolute inset-0 rounded-full bg-primary blur-md pointer-events-none"
              style={{ opacity: glowOpacity }}
            />

            <div 
              className="absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white shadow-sm z-10"
              data-testid="toggle-handle"
              style={{
                left: `${toggleX}px`,
                transform: `scale(${loadingPulse})`,
              }}
            />
          </div>
        </div>
    </div>
  );
};
