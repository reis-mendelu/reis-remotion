import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ProfessionalText } from "../components/ProfessionalText";
import { OutlookSyncComposition } from "./OutlookSync";
import { Background } from "../components/Background";
import { SoundEffect } from "../components/SoundEffect";

export const ReISIntroduction: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const TEXT_DURATION = 60;
  const ANIMATION_START = TEXT_DURATION;
  
  // Aggressive cinematic zoom
  const cinematicZoom = interpolate(frame, [0, durationInFrames], [1, 1.3]);

  return (
    <AbsoluteFill>
      <Background type="stars" starsCount={500} />
      
      <AbsoluteFill style={{ transform: `scale(${cinematicZoom})` }}>
        {/* Audio Track */}
        <Sequence from={0} durationInFrames={TEXT_DURATION}>
          <SoundEffect type="INTRO_SWOOSH" volume={0.6} />
        </Sequence>
        
        {/* Slide 1: MODERNIZOVANÝ IS */}
        <Sequence from={0} durationInFrames={TEXT_DURATION}>
          <AbsoluteFill className="items-center justify-center">
            <ProfessionalText text="MODERNIZOVANÝ IS" type="headline" mode="minimalist" />
          </AbsoluteFill>
        </Sequence>

        {/* Slide 2: Outlook Sync Animation */}
        <Sequence from={ANIMATION_START}>
          <OutlookSyncComposition
            enabled={true}
            loading={false}
            showInfo={false}
            progress={1}
            animate={true}
            rotationX={15}
            rotationY={-20}
            depth={0}
            syncStatus="syncing"
            eventCount={3}
            scale={3.0}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
