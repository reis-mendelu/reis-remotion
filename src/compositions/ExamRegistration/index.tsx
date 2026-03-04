import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "../../components/Background";
import { ExamPanelMockup } from "../../components/ExamPanel/ExamPanelMockup";
import type { ExamRegistrationProps } from "./schema";

// --- TIMELINE (240 frames = 8s @ 30fps) ---
// 0-20:    Panel springs in
// 15-25:   Cards stagger in
// 50-90:   Matematika card expands (height spring)
// 90-130:  TermTiles visible (staggered by height)
// 130:     Term 1 highlighted
// 145:     Spinner starts
// 165:     Registered — badge + details appear
// 165-240: Hold on final registered state

export const ExamRegistrationComposition: React.FC<ExamRegistrationProps> = ({ scale = 2 }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0c10",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Background type="stars" starsCount={500} />
      <ExamPanelMockup
        scale={scale}
        expandFrame={50}
        highlightFrame={130}
        processingFrame={145}
        successFrame={165}
      />
    </AbsoluteFill>
  );
};
