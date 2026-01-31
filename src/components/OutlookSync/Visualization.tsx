import React from "react";
import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EventCard } from "./EventCard";

interface VisualizationProps {
  syncStatus: "pending" | "syncing" | "completed";
  progress: number;
  eventCount: number;
}

export const SyncVisualization: React.FC<VisualizationProps> = ({ syncStatus, progress, eventCount }) => {
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

  // Mock data - normally this would come from props or an API
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
            className="h-full bg-primary"
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
