import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { AbsoluteFill, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { Calendar, Clock } from "lucide-react";
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
  // 3D Specific Props
  rotationX: z.number().default(0),
  rotationY: z.number().default(0),
  depth: z.number().default(0),
  // Sync Status Props
  syncStatus: z.enum(["pending", "syncing", "completed"]).default("pending"),
  eventCount: z.number().default(3),
});

const VideoOutlookSyncToggle: React.FC<{
  enabled: boolean | null;
  loading: boolean;
  showInfo: boolean;
  progress: number;
}> = ({ enabled, loading, showInfo, progress }) => {
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
      style={{ transformStyle: "preserve-3d" }}
    >
        <div className="flex items-center gap-2 flex-1" style={{ transform: "translateZ(10px)" }}>
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
        <div className="relative flex items-center gap-3" style={{ transform: "translateZ(15px)" }}>
          {/* Info section disabled/hidden as per request */}
          {/* 
          <div className="relative">
            <Info 
              size={14} 
              strokeWidth={1.5} 
              className="text-[#9ca3af]"
              style={{ opacity: showInfo ? 1 : 0.5 }}
            />
            ...
          </div>
          */}
          
          <div 
            className="w-8 h-5 rounded-full relative overflow-visible border border-base-content/10 shadow-inner"
            style={{
              backgroundColor: enabled ? background : "#374151", // base-300 dark
              opacity: loading ? 0.7 : 1,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Bloom/Glow effect */}
            <div 
              className="absolute inset-0 rounded-full bg-primary blur-md pointer-events-none"
              style={{ opacity: glowOpacity, transform: "translateZ(-1px)" }}
            />

            <div 
              className="absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white shadow-sm z-10"
              data-testid="toggle-handle"
              style={{
                left: `${toggleX}px`,
                transform: `scale(${loadingPulse}) translateZ(5px)`,
              }}
            />
          </div>
        </div>
    </div>
  );
};

const EventCard: React.FC<{
  title: string;
  time: string;
  progress: number;
  index: number;
  type: "lecture" | "exam" | "exercise";
}> = ({ title, time, progress, index, type }) => {
  const { fps } = useVideoConfig();
  
  const isExam = type === "exam";
  
  // Stagger start: each card starts 10 frames after the previous one
  const staggerStart = index * 10;
  const cardSpring = spring({
    frame: progress * 60 - staggerStart,
    fps,
    config: { damping: 15 },
  });

  const opacity = interpolate(cardSpring, [0, 1], [0, 1]);
  const translateX = interpolate(cardSpring, [0, 1], [20, 0]);
  const scale = interpolate(cardSpring, [0, 1], [0.95, 1]);

  if (cardSpring <= 0) return null;

  return (
    <div 
      className="flex items-center gap-4 p-3 rounded-xl border border-white/10 mb-2.5 last:mb-0 relative overflow-hidden shadow-lg"
      style={{
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
        transformStyle: "preserve-3d",
        backgroundColor: "rgba(22, 27, 34, 0.4)", // Translucent base
        backdropFilter: "blur(12px)", // Glassmorphism
      }}
    >
      {/* Surface Elevation Highlight */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" 
        style={{ transform: "translateZ(1px)" }}
      />

      {/* Category Accent */}
      <div 
        className={`w-1 h-8 rounded-full ${isExam ? "bg-[#f85149]" : "bg-primary"}`} 
        style={{ transform: "translateZ(2px)" }} 
      />
      
      <div className="flex flex-col gap-1 flex-1 items-start text-left" style={{ transform: "translateZ(3px)" }}>
        {/* Desaturated Event Type Tag - Czech Translation */}
        <span className={`text-[8px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-md ${isExam ? "bg-[#f85149]/20 text-[#f85149]/90" : "bg-primary/20 text-primary/90"}`}>
          {type === "lecture" ? "přednáška" : type === "exam" ? "zkouška" : "cvičení"}
        </span>
        
        <div className="text-[12px] font-semibold text-[#f0f6fc] leading-tight tracking-tight">
          {title}
        </div>
        
        <div className="flex items-center gap-1.5 mt-0.5">
          <Clock size={10} className="text-[#8b949e]" />
          <span className="text-[10px] text-[#8b949e] font-medium tracking-wide font-mono">
            {time}
          </span>
        </div>
      </div>
    </div>
  );
};

const SyncVisualization: React.FC<{
  syncStatus: "pending" | "syncing" | "completed";
  progress: number;
  eventCount: number;
}> = ({ syncStatus, progress, eventCount }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const isSyncing = syncStatus === "syncing" || syncStatus === "completed";
  
  const visSpring = spring({
    frame: isSyncing ? progress * 60 : 0,
    fps,
    config: { damping: 20 },
  });

  const height = interpolate(visSpring, [0, 1], [0, 180], { extrapolateRight: "clamp" });
  const opacity = interpolate(visSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  // Syncing Text Pulse
  const textPulse = interpolate(Math.sin((frame / fps) * Math.PI * 3), [-1, 1], [0.6, 1]);

  const mockEvents: Array<{ title: string; time: string; type: "lecture" | "exam" | "exercise" }> = [
    { title: "Přednáška: Algoritmizace", time: "Po 09:00 - 10:50", type: "lecture" },
    { title: "Zkouška: Matematika I", time: "St 10:00 - 12:00", type: "exam" },
    { title: "Cvičení: Programování", time: "Pá 14:00 - 15:40", type: "exercise" },
  ];


  return (
    <div 
      className="overflow-hidden mt-4"
      style={{ 
        height, 
        opacity,
        transformStyle: "preserve-3d",
        transform: "translateZ(5px)"
      }}
    >
      <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span 
            className="text-[10px] font-bold uppercase tracking-wider text-primary"
            style={{ opacity: syncStatus === "syncing" ? textPulse : 1 }}
          >
            {syncStatus === "syncing" ? "Synchronizace..." : "Synchronizace dokončena"}
          </span>
          <span className="text-[10px] font-bold font-mono text-[#8b949e]">{Math.round(progress * 100)}%</span>
        </div>

        {/* Progress Bar - Left to Right flow */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-100 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Event List */}
        <div className="flex flex-col">
          {mockEvents.slice(0, eventCount).map((event, i) => (
            <EventCard 
              key={i}
              index={i}
              title={event.title}
              time={event.time}
              progress={progress}
              type={event.type}
            />
          ))}
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
  rotationX: staticRotX = 0,
  rotationY: staticRotY = 0,
  depth: staticDepth = 0,
  syncStatus = "pending",
  eventCount = 3,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  
  const progress = animate 
    ? interpolate(frame, [15, durationInFrames - 1], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
    : staticProgress;

  const rotX = animate
    ? interpolate(frame, [0, durationInFrames], [15, staticRotX])
    : staticRotX;

  const rotY = animate
    ? interpolate(frame, [0, durationInFrames], [-10, staticRotY])
    : staticRotY;

  const entrance = spring({
    frame,
    fps,
    config: { damping: 20 },
  });

  const entranceOpacity = interpolate(entrance, [0, 0.5], [0, 1]);
  const entranceY = interpolate(entrance, [0, 1], [20, 0]);
  
  // Lollapalooza Shadowing: Multi-layered shadow to simulate depth
  const shadowDepth = interpolate(rotX, [-45, 45], [20, -20]);
  const shadowBlur = Math.abs(rotX) + Math.abs(rotY) + 10;
  
  // Audio Feedback: Click sound synced with toggle start (frame 15)
  // Wrapped in Sequence to ensure the file plays from the beginning (startFrom crops the source!)
  const audioTrack = animate ? (
    <Sequence from={15}>
      <Audio 
        src={staticFile("kenney_ui-audio/Audio/click1.ogg")} 
        volume={1.0} // Robust volume
      />
    </Sequence>
  ) : null;

  return (
    <AbsoluteFill className="bg-[#0f1113] items-center justify-center" style={{ perspective: "1200px" }}>
      {audioTrack}
      <MendeluEnvironment className="w-full h-full flex items-center justify-center">
        <div 
          className="w-80 bg-[#1e2329] p-4 rounded-xl border border-white/5"
          style={{
            opacity: entranceOpacity,
            transformStyle: "preserve-3d",
            transform: `translateY(${entranceY}px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${staticDepth}px)`,
            boxShadow: `
              ${-rotY / 2}px ${shadowDepth}px ${shadowBlur}px rgba(0,0,0,0.5),
              0 0 40px rgba(0,0,0,0.2)
            `,
          }}
        >
          {/* Faux "Thickness" - Layered borders to simulate a 3D side */}
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
    </AbsoluteFill>
  );
};

