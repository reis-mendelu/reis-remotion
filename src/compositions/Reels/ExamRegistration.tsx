import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { Background } from "../../components/Background";
import { BrandedEndSlide } from "../BrandedEndSlide";
import { KineticText } from "./components/KineticText";
import { ExamPanelMockup } from "../../components/ExamPanel/ExamPanelMockup";
import { SoundEffect } from "../../components/SoundEffect";

// --- TIMELINE (370 frames = ~12.3s @ 30fps) ---
// 0-20:    Panel springs in
// 10-50:   KineticText "Přihlas se ke zkoušce →"
// 50-90:   Card expands
// 130:     Term highlight (cursor)
// 145:     Spinner
// 165:     Registered — badge + details appear
// 165-270: Linger on registered state
// 255-270: Panel fades out
// 270-370: BrandedEndSlide (90 frames → CTA text visible at local f30-50)

const PANEL_FADE_START = 255;
const END_CARD_START = 270;

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
          expandFrame={50}
          highlightFrame={130}
          processingFrame={145}
          successFrame={165}
        />

        {/* Sound effects */}
        <Sequence>
          <SoundEffect type="SWOOSH" volume={0.5} />
        </Sequence>
        <Sequence from={130}>
          <SoundEffect type="TOGGLE_ON" volume={0.3} />
        </Sequence>
        <Sequence from={165}>
          <SoundEffect type="SUCCESS" volume={0.5} />
        </Sequence>
      </AbsoluteFill>

      {/* Kinetic text overlay */}
      <KineticText
        text="Přihlas se ke zkoušce →"
        startFrame={10}
        duration={45}
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
