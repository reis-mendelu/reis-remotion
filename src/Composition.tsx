import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { Calendar, Info } from "lucide-react";
import { AbsoluteFill, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
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

  // Info Popup Animation
  const infoSpring = spring({
    frame: showInfo ? frame % 30 : 0, // Simplified for demo, usually driven by a prop
    fps,
    config: { damping: 15 },
  });

  return (
    <div className="flex items-center justify-between gap-3 px-1 py-2 rounded-lg hover:bg-base-200 w-full relative">
        <div className="flex items-center gap-2 flex-1">
          <Calendar size={16} strokeWidth={1.5} className="text-[#9ca3af] opacity-40" />
          <span className="text-xs text-[#f3f4f6] opacity-50">Synchronizace rozvrhu</span>
        </div>
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <Info size={14} strokeWidth={1.5} className="text-[#9ca3af] opacity-50" />
            
            {showInfo && (
              <div 
                className="absolute bottom-full right-0 mb-2 w-64 bg-base-200 rounded-lg shadow-lg border border-base-300 p-3 z-[100]"
                style={{
                  opacity: interpolate(infoSpring, [0, 1], [0, 1]),
                  transform: `scale(${interpolate(infoSpring, [0, 1], [0.95, 1])}) translateY(${interpolate(infoSpring, [0, 1], [5, 0])}px)`,
                }}
              >
                <p className="text-xs leading-relaxed text-[#9ca3af]">
                  Synchronizuje rozvrhu a termíny zkoušek do Outlooku.
                </p>
              </div>
            )}
          </div>
          
          {/* Custom Frame-Accurate Toggle */}
          <div 
            className="w-8 h-5 rounded-full relative overflow-hidden border border-base-content/10"
            style={{
              backgroundColor: enabled ? background : "#374151", // base-300 dark
              opacity: loading ? 0.7 : 1,
            }}
          >
            <div 
              className="absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white shadow-sm"
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

  return (
    <AbsoluteFill className="bg-[#0f1113] items-center justify-center">
      <MendeluEnvironment className="w-full h-full flex items-center justify-center">
        <div 
          className="w-72 bg-base-100 p-4 rounded-xl shadow-2xl border border-base-300"
          style={{
            opacity: entranceOpacity,
            transform: `translateY(${entranceY}px)`,
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

