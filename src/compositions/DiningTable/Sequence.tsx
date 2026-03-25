import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { DiningTableComposition } from "./index";
import { BrandedEndSlide } from "../BrandedEndSlide";
import { DiningTableProps } from "./schema";

export const DiningTableSequence: React.FC<DiningTableProps> = (props) => {
  // DiningTable content: 0–150 frames (5 seconds)
  // End slide: 150–270 frames (4 seconds)
  // Total: 270 frames (9 seconds)
  
  const CONTENT_DURATION = 150;
  const END_SLIDE_DURATION = 120;

  return (
    <AbsoluteFill className="bg-[#0a0c10]">
      <Sequence durationInFrames={CONTENT_DURATION}>
        <DiningTableComposition {...props} />
      </Sequence>
      
      <Sequence from={CONTENT_DURATION} durationInFrames={END_SLIDE_DURATION}>
        <BrandedEndSlide
          logoScale={1.5}
          theme="dark"
          animate={true}
          ctaText="Link v biu"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
