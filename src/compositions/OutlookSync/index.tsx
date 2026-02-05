import React from "react";
import { z } from "zod";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence, Img, staticFile } from "remotion";
import { MendeluEnvironment } from "../../Environment";
import { SoundEffect } from "../../components/SoundEffect";
import { SynchronizationButton } from "../../components/OutlookSync/SynchronizationButton";
import { SyncVisualization } from "../../components/OutlookSync/Visualization";
import { zBackground } from "../../components/Background/schema";
import { Background } from "../../components/Background";

export const OutlookSyncSchema = z.object({
  enabled: z.boolean().nullable(),
  loading: z.boolean(),
  showInfo: z.boolean().default(false),
  progress: z.number().min(0).max(1).default(1),
  animate: z.boolean().default(false),
  rotationX: z.number().default(0),
  rotationY: z.number().default(0),
  depth: z.number().default(0),
  syncStatus: z.enum(["pending", "syncing", "completed"]).default("pending"),
  eventCount: z.number().default(3),
  scale: z.number().default(1),
  background: zBackground.optional(),
  isDone: z.boolean().default(false),
  showVisualization: z.boolean().default(true),
  toggleProgress: z.number().default(1),
});

export const OutlookSyncComposition: React.FC<z.infer<typeof OutlookSyncSchema> & { children?: React.ReactNode }> = ({
  enabled,
  loading,
  showInfo,
  progress: staticProgress,
  animate,
  // Unused props removed from destructuring to satisfy linter
  // rotationX, rotationY, depth, isDone
  syncStatus = "pending",
  eventCount = 3,
  scale = 1,
  background,
  children,
  showVisualization = true,
  toggleProgress = 1,
}) => {
  const { fps } = useVideoConfig();
  
  const SYNC_START = 15;
  const SYNC_DURATION = 50;
  const SYNC_END = SYNC_START + SYNC_DURATION;

  const frame = useCurrentFrame();
  const progress = animate 
    ? interpolate(frame, [SYNC_START, SYNC_END], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
    : staticProgress;

  const entrance = spring({
    frame: useCurrentFrame(),
    fps,
    config: { damping: 20 },
  });

  const entranceOpacity = interpolate(entrance, [0, 0.5], [0, 1]);
  const entranceY = interpolate(entrance, [0, 1], [20, 0]);
  
  const audioTrack = animate ? (
    <>
       <Sequence>
          <SoundEffect type="SWOOSH" volume={0.6} />
       </Sequence>
      <Sequence from={SYNC_START}>
         <SoundEffect type="TOGGLE_ON" volume={0.8} />
      </Sequence>
      <Sequence from={SYNC_END}>
         <SoundEffect type="SUCCESS" volume={0.6} />
      </Sequence>
    </>
  ) : null;

  return (
    <AbsoluteFill>
      {background && <Background {...background} />}
      {audioTrack}

      <MendeluEnvironment 
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: "transparent" }}
      >
        <div className="flex flex-row items-center justify-center gap-8"
             style={{
               opacity: entranceOpacity,
               transform: `scale(${scale}) translateY(${entranceY}px)`,
             }}
        >
          {/* Mendelu Logo - BrandedEndSlide style */}
          <div style={{ 
            position: "relative",
            zIndex: 10,
            borderRadius: "50%",
            overflow: "hidden",
            width: "55px",
            height: "55px",
            backgroundColor: "#ffffff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            flexShrink: 0
          }}>
            <Img 
              src={staticFile("mendelu_logo.png")} 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "contain",
                padding: "8px", 
              }} 
            />
          </div>

        <div 
          className="w-80 bg-[#1e2329] p-4 rounded-xl border border-white/5"
          style={{
            boxShadow: `0 20px 60px rgba(0,0,0,0.3)`,
          }}
        >


          <SynchronizationButton
            enabled={enabled}
            loading={loading}
            showInfo={showInfo}
            progress={progress}
            toggleProgress={toggleProgress}
          />

          {showVisualization && (
            <SyncVisualization 
              syncStatus={syncStatus}
              progress={progress}
              eventCount={eventCount}
            />
          )}
        </div>
        </div>
        {children}
      </MendeluEnvironment>
    </AbsoluteFill>
  );
};
