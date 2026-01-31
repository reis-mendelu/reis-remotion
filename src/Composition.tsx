import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { AbsoluteFill, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { Calendar, Info } from "lucide-react";
import { MendeluEnvironment } from "./Environment";

export const MyCompositionSchema = z.object({
  title: z.string(),
  logoColor: zColor(),
});

export const MyComposition: React.FC<z.infer<typeof MyCompositionSchema>> = ({
  title,
  logoColor,
}) => {
  return (
    <AbsoluteFill className="bg-white items-center justify-center">
      <div
        style={{ color: logoColor }}
        className="text-8xl font-bold font-sans"
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};

export const OutlookSyncSchema = z.object({
  enabled: z.boolean().nullable(),
  loading: z.boolean(),
  showInfo: z.boolean().default(false),
  progress: z.number().min(0).max(1).default(1),
  animate: z.boolean().default(false),
});

const VideoOutlookSyncToggle: React.FC<{
  enabled: boolean | null;
  loading: boolean;
  showInfo: boolean;
  progress: number;
}> = ({ enabled, loading, showInfo, progress }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  
  // Munger-style High-Reliability Spring for toggle
  const springProgress = spring({
    frame: progress * 30, 
    fps,
    config: {
      damping: 20,
      stiffness: 200,
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

  // Info Popup Animation
  const infoSpring = spring({
    frame: showInfo ? frame % 30 : 0, // Simplified for demo, usually driven by a prop
    fps,
    config: { damping: 15 },
  });

  return (
    <div className="flex items-center justify-between gap-3 px-1 py-2 rounded-lg hover:bg-base-200 w-full relative">
        {/* 
          PREMIUM SFX: Audio is vital for immersion. 
          Place 'click.mp3' and 'whoosh.mp3' in /public and use <Audio> components here.
        */}

        <div className="flex items-center gap-2 flex-1">
          <Calendar 
            size={16} 
            strokeWidth={1.5} 
            className="text-[#9ca3af]"
            style={{ 
              opacity: interpolate(springProgress, [0, 1], [0.4, 0.8]),
              transform: `scale(${interpolate(springProgress, [0, 1], [1, 1.1])})`
            }} 
          />
          <span className="text-xs text-[#f3f4f6]" style={{ opacity: interpolate(springProgress, [0, 1], [0.5, 0.8]) }}>
            Synchronizace rozvrhu
          </span>
        </div>
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <Info 
              size={14} 
              strokeWidth={1.5} 
              className="text-[#9ca3af]"
              style={{ opacity: showInfo ? 1 : 0.5 }}
            />
            
            {showInfo && (
              <div 
                className="absolute bottom-full right-0 mb-2 w-64 bg-base-200/90 backdrop-blur-md rounded-lg shadow-lg border border-base-300 p-3 z-[100]"
                style={{
                  opacity: interpolate(infoSpring, [0, 1], [0, 0.95]),
                  transform: `scale(${interpolate(infoSpring, [0, 1], [0.95, 1])}) translateY(${interpolate(infoSpring, [0, 1], [5, 0])}px)`,
                }}
              >
                <p className="text-xs leading-relaxed text-[#9ca3af]">
                  Synchronizuje rozvrhu a termíny zkoušek do Outlooku.
                </p>
              </div>
            )}
          </div>
          
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

export const OutlookSyncComposition: React.FC<z.infer<typeof OutlookSyncSchema>> = ({
  enabled,
  loading,
  showInfo,
  progress: staticProgress,
  animate,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  
  const progress = animate 
    ? interpolate(frame, [0, durationInFrames - 1], [0, 1], { extrapolateRight: "clamp" })
    : staticProgress;

  const entrance = spring({
    frame,
    fps,
    config: { damping: 20 },
  });

  const entranceOpacity = interpolate(entrance, [0, 0.5], [0, 1]);
  const entranceY = interpolate(entrance, [0, 1], [20, 0]);
  const entranceRotateX = interpolate(entrance, [0, 1], [15, 0]); // Subtle tilt back

  return (
    <AbsoluteFill className="bg-[#0f1113] items-center justify-center" style={{ perspective: "1000px" }}>
      <MendeluEnvironment className="w-full h-full flex items-center justify-center">
        <div 
          className="w-72 bg-base-100 p-4 rounded-xl shadow-2xl border border-base-300"
          style={{
            opacity: entranceOpacity,
            transform: `translateY(${entranceY}px) rotateX(${entranceRotateX}deg)`,
            transformOrigin: "bottom",
          }}
        >
          <VideoOutlookSyncToggle
            enabled={enabled}
            loading={loading}
            showInfo={showInfo}
            progress={progress}
          />
        </div>
      </MendeluEnvironment>
    </AbsoluteFill>
  );
};

