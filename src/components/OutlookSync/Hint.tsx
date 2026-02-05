import React from "react";
import { useCurrentFrame, Sequence, interpolate, useVideoConfig, spring } from "remotion";
import { OutlookSyncComposition } from "../../compositions/OutlookSync/index";
import { SoundEffect } from "../../components/SoundEffect";

export const OutlookSyncHint: React.FC<{
  scale?: number;
}> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- ORCHESTRATION: 4s TIMELINE (120 frames @ 30fps) ---
  
  // Phase 1: Setup (0-20 frames) 
  // Phase 2: Trigger (20-30 frames) - Toggle ON (VERY QUICK)
  // Phase 3: Process (30-80 frames) - Progress 0-100%
  // Phase 4: Satisfaction (80-120 frames) - Linger
  
  const TRIGGER_START = 20;

  // Toggle Animation (Quick Spring)
  const toggleSpring = spring({
    frame: frame - TRIGGER_START,
    fps,
    config: {
      damping: 10,  // Low damping for speed
      stiffness: 200, // High stiffness for snap
      mass: 0.5,
    },
  });

  const toggleEnabled = frame >= TRIGGER_START;
  
  // Progress Bar - Syncing
  const progress = interpolate(
    frame,
    [30, 80],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const syncStatus = frame < 30 
    ? "pending" 
    : frame < 80 
      ? "syncing" 
      : "completed";

  const eventCount = 3; // Static count as we hid the list anyway
  const isDone = frame >= 80;

  return (
    <OutlookSyncComposition
      {...props}
      enabled={toggleEnabled}
      loading={syncStatus === "syncing"}
      showInfo={false}
      progress={progress}
      toggleProgress={toggleSpring}
      syncStatus={syncStatus}
      eventCount={eventCount}
      animate={false} 
      background={undefined}
      rotationX={0}
      rotationY={0}
      depth={0}
      scale={props.scale ?? 1}
      isDone={isDone}
      showVisualization={false}
    >
      {/* Audio Orchestration */}
      
      {/* Entrance Swoosh */}
      <Sequence durationInFrames={20}>
          <SoundEffect type="SWOOSH" volume={0.6} />
      </Sequence>

      {/* Toggle Click */}
      <Sequence from={TRIGGER_START}>
          <SoundEffect type="TOGGLE_ON" volume={0.8} />
      </Sequence>

      {/* Final Success */}
      <Sequence from={80}>
          <SoundEffect type="SUCCESS" volume={0.6} />
      </Sequence>
    </OutlookSyncComposition>
  );
};
