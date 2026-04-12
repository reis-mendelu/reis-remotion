import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, interpolate, useVideoConfig } from "remotion";
import { OutlookSyncComposition } from "../../compositions/OutlookSync/index";

export const OutlookSyncScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Relative timeline percentages
  const TOGGLE_PCT = 0.1;
  const SYNC_START_PCT = 0.2;
  const SYNC_END_PCT = 0.8;

  const toggleFrame = Math.floor(durationInFrames * TOGGLE_PCT);
  const syncStartFrame = Math.floor(durationInFrames * SYNC_START_PCT);
  const syncEndFrame = Math.floor(durationInFrames * SYNC_END_PCT);

  const entranceSpring = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const scale = interpolate(entranceSpring, [0, 1], [1.4, 1.8]);
  
  const toggleSpring = spring({
    frame: frame - toggleFrame,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.5 },
  });

  const progress = interpolate(frame, [syncStartFrame, syncEndFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const syncStatus: "pending" | "syncing" | "completed" = 
    frame < syncStartFrame ? "pending" : frame < syncEndFrame ? "syncing" : "completed";

  return (
    <AbsoluteFill className="flex items-center justify-center">
      <OutlookSyncComposition
        enabled={frame >= toggleFrame}
        loading={syncStatus === "syncing"}
        showInfo={false}
        progress={progress}
        animate={false}
        toggleProgress={toggleSpring}
        syncStatus={syncStatus}
        eventCount={3}
        scale={scale}
        background={undefined}
        rotationX={0}
        rotationY={0}
        depth={0}
        isDone={frame >= syncEndFrame}
        showVisualization={frame >= syncStartFrame}
      />
    </AbsoluteFill>
  );
};
