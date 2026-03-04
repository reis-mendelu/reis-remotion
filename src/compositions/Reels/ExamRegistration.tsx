import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { Background } from "../../components/Background";
import { BrandedEndSlide } from "../BrandedEndSlide";
import { KineticText } from "./components/KineticText";
import { ExamPanelMockup } from "../../components/ExamPanel/ExamPanelMockup";
import { SoundEffect } from "../../components/SoundEffect";

// --- TIMELINE (286 frames = ~9.5s @ 30fps) ---
// 0-20:    Panel springs in
// 10-40:   KineticText "Přihlas se ke zkoušce →"
// 40-80:   Card expands
// 100:     Term highlight (cursor)
// 112:     Spinner
// 125:     Registered — badge + details appear
// 125-186: Linger on registered state
// 171-186: Panel fades out
// 186-286: BrandedEndSlide

const PANEL_FADE_START = 171;
const END_CARD_START = 186;

export const ReelExamRegistration: React.FC = () => {
  const frame = useCurrentFrame();

  const panelFadeOut =
    frame >= PANEL_FADE_START
      ? interpolate(frame, [PANEL_FADE_START, END_CARD_START], [1, 0], { extrapolateRight: "clamp" })
      : 1;

  const endCardOpacity =
    frame >= END_CARD_START
      ? interpolate(frame, [END_CARD_START, END_CARD_START + 10], [0, 1], { extrapolateRight: "clamp" })
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0c10" }}>
      <Background type="stars" starsCount={500} />

      {/* Phase 1: ExamPanel registration demo */}
      <AbsoluteFill
        style={{
          opacity: panelFadeOut,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ExamPanelMockup
          scale={1.8}
          expandFrame={40}
          highlightFrame={100}
          processingFrame={112}
          successFrame={125}
        />

        {/* Sound effects */}
        <Sequence>
          <SoundEffect type="SWOOSH" volume={0.5} />
        </Sequence>
        <Sequence from={100}>
          <SoundEffect type="TOGGLE_ON" volume={0.3} />
        </Sequence>
        <Sequence from={125}>
          <SoundEffect type="SUCCESS" volume={0.5} />
        </Sequence>
      </AbsoluteFill>

      {/* Kinetic text overlay */}
      <KineticText
        text="Přihlas se ke zkoušce →"
        startFrame={10}
        duration={30}
        fontSize={52}
        top="22%"
      />

      {/* End card */}
      <Sequence from={END_CARD_START}>
        <AbsoluteFill style={{ opacity: endCardOpacity }}>
          <BrandedEndSlide
            logoScale={1.0}
            theme="dark"
            animate={true}
            ctaText="Link v biu"
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
