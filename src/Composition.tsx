import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { MendeluEnvironment } from "./Environment";
import { SoundEffect } from "./components/SoundEffect";
import { VideoOutlookSyncToggle } from "./components/OutlookSync/Toggle";
import { SyncVisualization } from "./components/OutlookSync/Visualization";
import { zBackground } from "./components/Background/schema";
import { Background } from "./components/Background";
import { ProfessionalText } from "./components/ProfessionalText";


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
  // 3D Specific Props
  rotationX: z.number().default(0),
  rotationY: z.number().default(0),
  depth: z.number().default(0),
  // Sync Status Props
  syncStatus: z.enum(["pending", "syncing", "completed"]).default("pending"),
  eventCount: z.number().default(3),
  // 4K Scaling Support
  scale: z.number().default(1),
  // Background
  background: zBackground.optional(),
});





export const OutlookSyncComposition: React.FC<z.infer<typeof OutlookSyncSchema>> = ({
  enabled,
  loading,
  showInfo,
  progress: staticProgress,
  animate,
  rotationX: staticRotX = 0,
  rotationY: staticRotY = 0,
  depth: staticDepth = 0,
  syncStatus = "pending",
  eventCount = 3,
  scale = 1,
  background,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  
  // Scene Timing (Frames)
  const HOOK_DURATION = 45;
  const CONTEXT_DURATION = 45;
  const DEMO_START = HOOK_DURATION + CONTEXT_DURATION;
  const DEMO_DURATION = 120;
  const CTA_START = DEMO_START + DEMO_DURATION;
  
  // Internal Demo Timing
  const SYNC_START = 15;
  const SYNC_DURATION = 50;
  const SYNC_END = SYNC_START + SYNC_DURATION;

  const progress = animate 
    ? interpolate(frame - DEMO_START, [SYNC_START, SYNC_END], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
    : staticProgress;

  const rotX = animate
    ? interpolate(frame - DEMO_START, [0, DEMO_DURATION], [15, staticRotX])
    : staticRotX;

  const rotY = animate
    ? interpolate(frame - DEMO_START, [0, DEMO_DURATION], [-10, staticRotY])
    : staticRotY;

  const entrance = spring({
    frame: frame - DEMO_START,
    fps,
    config: { damping: 20 },
  });

  const entranceOpacity = interpolate(entrance, [0, 0.5], [0, 1]);
  const entranceY = interpolate(entrance, [0, 1], [20, 0]);
  
  const shadowDepth = interpolate(rotX, [-45, 45], [20, -20]);
  const shadowBlur = Math.abs(rotX) + Math.abs(rotY) + 10;
  
  const audioTrack = animate ? (
    <>
      <Sequence from={0} durationInFrames={HOOK_DURATION}>
         <SoundEffect type="INTRO_SWOOSH" volume={0.6} />
      </Sequence>
      <Sequence from={DEMO_START}>
         <SoundEffect type="SWOOSH" volume={0.6} />
      </Sequence>
      <Sequence from={DEMO_START + SYNC_START}>
         <SoundEffect type="TOGGLE_ON" volume={0.8} />
      </Sequence>
      <Sequence from={DEMO_START + SYNC_END}>
         <SoundEffect type="SUCCESS" volume={0.6} />
      </Sequence>
      <Sequence from={CTA_START}>
         <SoundEffect type="OUTRO_CHIME" volume={0.7} />
      </Sequence>
    </>
  ) : null;

  const cinematicZoom = animate
    ? interpolate(frame, [0, durationInFrames], [1, 1.05])
    : 1;

  return (
    <AbsoluteFill style={{ perspective: "1200px", transform: `scale(${cinematicZoom})` }}>
      <Background 
        {...(background ?? {
          preset: "mendelu-dark"
        })}
      />
      {audioTrack}

      {/* Scene 1: Hook */}
      <Sequence from={0} durationInFrames={HOOK_DURATION}>
        <AbsoluteFill className="items-center justify-center">
          <ProfessionalText 
            text="REIS - Univerzitní systém modernizovaný" 
            type="hook" 
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Context */}
      <Sequence from={HOOK_DURATION} durationInFrames={CONTEXT_DURATION}>
        <AbsoluteFill className="items-center justify-center">
          <ProfessionalText 
            text="Vše pod kontrolou. Synchronizováno na všech zařízeních." 
            type="context" 
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Demo */}
      <Sequence from={DEMO_START} durationInFrames={DEMO_DURATION}>
        <MendeluEnvironment className="w-full h-full flex items-center justify-center">
          <div 
            className="w-80 bg-[#1e2329] p-4 rounded-xl border border-white/5"
            style={{
              opacity: entranceOpacity,
              transformStyle: "preserve-3d",
              transform: `scale(${scale}) translateY(${entranceY}px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${staticDepth}px)`,
              boxShadow: `
                ${-rotY / 2}px ${shadowDepth}px ${shadowBlur}px rgba(0,0,0,0.5),
                0 0 40px rgba(0,0,0,0.2)
              `,
            }}
          >
            <div 
              className="absolute inset-0 rounded-xl bg-[#1e2329] border border-white/10"
              style={{ transform: "translateZ(-2px)" }}
            />
            <div 
              className="absolute inset-0 rounded-xl bg-black/40"
              style={{ transform: "translateZ(-4px)" }}
            />

            <VideoOutlookSyncToggle
              enabled={enabled}
              loading={loading}
              showInfo={showInfo}
              progress={progress}
            />

            <SyncVisualization 
              syncStatus={syncStatus}
              progress={progress}
              eventCount={eventCount}
            />
          </div>
        </MendeluEnvironment>
      </Sequence>

      {/* Scene 4: CTA */}
      <Sequence from={CTA_START}>
        <AbsoluteFill className="items-center justify-center">
          <ProfessionalText 
            text="Vyzkoušejte nový REIS." 
            type="headline" 
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

