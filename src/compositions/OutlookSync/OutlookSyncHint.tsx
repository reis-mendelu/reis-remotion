import React from "react";
import { useCurrentFrame, Sequence, interpolate } from "remotion";
import { OutlookSyncComposition } from "./index";
import { SoundEffect } from "../../components/SoundEffect";

export const OutlookSyncHint: React.FC<{
  scale?: number;
}> = (props) => {
  const frame = useCurrentFrame();

  // --- ORCHESTRATION: 4-PHASE ANIMATION (240 frames @ 30fps = 8 seconds) ---
  
  // Phase 1: Setup (0-45 frames) - Empty state
  // Phase 2: Trigger (45-60 frames) - Toggle ON
  // Phase 3: Process (60-180 frames) - Progress 0-100%
  // Phase 4: Satisfaction (180-240 frames) - Success state lingers
  
  const toggleEnabled = frame >= 45;
  
  const progress = interpolate(
    frame,
    [60, 180],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const syncStatus = frame < 60 
    ? "pending" 
    : frame < 180 
      ? "syncing" 
      : "completed";

  // Staggered event population: events appear as progress increases
  // We have 3 events.
  const eventCount = progress < 0.3 
    ? 0 
    : progress < 0.6 
      ? 1 
      : progress < 0.9 
        ? 2 
        : 3;

  const isDone = frame >= 180;

  return (
    <OutlookSyncComposition
      {...props}
      enabled={toggleEnabled}
      loading={syncStatus === "syncing"}
      showInfo={false}
      progress={progress}
      syncStatus={syncStatus}
      eventCount={eventCount}
      animate={false} // We handle animation manually here
      background={undefined} // Handled by the introduction
      rotationX={0}
      rotationY={0}
      depth={0}
      scale={props.scale ?? 1}
      isDone={isDone}
    >
      {/* Audio Orchestration */}
      
      {/* Entrance Swoosh */}
      <Sequence from={0} durationInFrames={30}>
          <SoundEffect type="SWOOSH" volume={0.6} />
      </Sequence>

      {/* Toggle Click */}
      <Sequence from={45}>
          <SoundEffect type="TOGGLE_ON" volume={0.8} />
      </Sequence>

      {/* Completion Chimes - Staggered with event appearance or final success */}
      {/* Event 1 */}
      {progress >= 0.3 && frame < 65 && (
          <SoundEffect type="SUCCESS" volume={0.3} />
      )}
      
      {/* Event 2 */}
      {progress >= 0.6 && frame < 125 && (
          <SoundEffect type="SUCCESS" volume={0.3} />
      )}

      {/* Final Success */}
      <Sequence from={180}>
          <SoundEffect type="SUCCESS" volume={0.6} />
      </Sequence>
    </OutlookSyncComposition>
  );
};
