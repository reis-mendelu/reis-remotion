import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ProfessionalText } from "../components/ProfessionalText";
import { OutlookSyncComposition } from "./OutlookSync";
import { Background } from "../components/Background";
import { SoundEffect } from "../components/SoundEffect";
import { FilesHint } from "./SubjectDrawer/FilesHint";

export const ReISIntroduction: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Unified Timeline Logic (30fps)
  const ACT1_START = 0;
  const ACT1_DURATION = 60; // 2s

  const ACT2_START = ACT1_START + ACT1_DURATION;
  const ACT2_DURATION = 120; // 4s

  const ACT3_START = ACT2_START + ACT2_DURATION;
  const ACT3_DURATION = 60; // 2s

  const ACT4_START = ACT3_START + ACT3_DURATION;
  // ACT4 goes until the end (360)
  
  // Aggressive cinematic zoom across the whole sequence
  const cinematicZoom = interpolate(frame, [0, durationInFrames], [1, 1.25], {
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill className="bg-[#0a0c10]">
      <Background type="stars" starsCount={500} />
      
      <AbsoluteFill style={{ transform: `scale(${cinematicZoom})` }}>
        {/* Act I: MODERNIZOVANÝ IS */}
        <Sequence from={ACT1_START} durationInFrames={ACT1_DURATION}>
          <AbsoluteFill className="items-center justify-center">
            <SoundEffect type="INTRO_SWOOSH" volume={0.6} />
            <ProfessionalText text="MODERNIZOVANÝ reIS" type="headline" mode="minimalist" />
          </AbsoluteFill>
        </Sequence>

        {/* Act II: Outlook Sync Animation */}
        <Sequence from={ACT2_START} durationInFrames={ACT2_DURATION}>
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

        {/* Act III: VŠE NA TŘI KLIKY */}
        <Sequence from={ACT3_START} durationInFrames={ACT3_DURATION}>
          <AbsoluteFill className="items-center justify-center">
            <SoundEffect type="INTRO_SWOOSH" volume={0.4} />
            <ProfessionalText text="VŠE NA TŘI KLIKY" type="hook" mode="minimalist" />
          </AbsoluteFill>
        </Sequence>

        {/* Act IV: Subject Drawer / Files Interaction */}
        <Sequence from={ACT4_START}>
          <FilesHint 
            animate={true}
            rotationX={25}
            rotationY={-15}
            depth={50}
            scale={2}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
