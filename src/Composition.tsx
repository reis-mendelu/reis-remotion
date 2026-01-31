import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { Calendar, Info } from "lucide-react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
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
  progress: z.number().min(0).max(1).default(1),
  animate: z.boolean().default(false),
});

const VideoOutlookSyncToggle: React.FC<{
  enabled: boolean | null;
  progress: number;
}> = ({ enabled, progress }) => {
  // Map progress (0-1) to toggle position and colors
  // toggle-sm is approx 32px (w-8) x 20px (h-5)
  // handle is approx 14px (w-3.5), with 3px visible margin
  const toggleX = interpolate(progress, [0, 1], [4, 14]);
  const bgColor = interpolate(progress, [0, 1], [0.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div className="flex items-center justify-between gap-3 px-1 py-2 rounded-lg hover:bg-base-200 w-full">
        <div className="flex items-center gap-2 flex-1">
          <Calendar size={16} strokeWidth={1.5} className="text-[#9ca3af] opacity-40" />
          <span className="text-xs text-[#f3f4f6] opacity-50">Synchronizace rozvrhu</span>
        </div>
        <div className="relative flex items-center gap-3">
          <Info size={14} strokeWidth={1.5} className="text-[#9ca3af] opacity-50" />
          
          {/* Custom Frame-Accurate Toggle (matches toggle-sm visually) */}
          <div 
            className="w-8 h-5 rounded-full relative overflow-hidden bg-base-300 border border-base-content/10"
            style={{
              backgroundColor: enabled ? `rgba(121, 190, 21, ${bgColor})` : "oklch(var(--b3))"
            }}
          >
            <div 
              className="absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white shadow-sm"
              style={{
                left: `${toggleX}px`
              }}
            />
          </div>
        </div>
    </div>
  );
};

export const OutlookSyncComposition: React.FC<z.infer<typeof OutlookSyncSchema>> = ({
  enabled,
  progress: staticProgress,
  animate,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  
  // If animate is true, override static progress with a frame-based one
  const progress = animate 
    ? interpolate(frame, [0, durationInFrames - 1], [0, 1], { extrapolateRight: "clamp" })
    : staticProgress;

  return (
    <AbsoluteFill className="bg-[#0f1113] items-center justify-center">
      <MendeluEnvironment className="w-full h-full flex items-center justify-center">
        <div className="w-72 bg-base-100 p-4 rounded-xl shadow-2xl border border-base-300">
          <VideoOutlookSyncToggle
            enabled={enabled}
            progress={progress}
          />
        </div>
      </MendeluEnvironment>
    </AbsoluteFill>
  );
};
