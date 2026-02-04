import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ProfessionalText } from "../components/ProfessionalText";
import { Background } from "../components/Background";
import { FilesHint } from "./SubjectDrawer/FilesHint";
import { BrandedEndSlide } from "./BrandedEndSlide";

/**
 * ReIS Introduction: Emotional Narrative Arc
 * Following Apple/Google best practices:
 * - ONE hero feature (SubjectDrawer)
 * - Clear problem → solution arc
 * - 24 seconds optimal length
 */
export const ReISIntroduction: React.FC = () => {
  // ============================================================================
  // TIMELINE: 15.5 seconds @ 30fps = 465 frames (streamlined, quick demo)
  // ============================================================================
  
  // ACT 0: Problem Setup (2.5s)
  const ACT0_START = 0;
  const ACT0_DURATION = 75; // 2.5s
  
  // ACT 1: Question Hook (1.5s)
  const ACT1_START = ACT0_START + ACT0_DURATION;
  const ACT1_DURATION = 45; // 1.5s
  
  // ACT 2: Hero Feature - SubjectDrawer (8s) - FilesHint with folder destination
  const ACT2_START = ACT1_START + ACT1_DURATION;
  const ACT2_DURATION = 240; // 8s (quick demo with 1s folder linger)
  
  // ACT 3: Brand + CTA (3s) - No payoff slide, direct to CTA
  const ACT3_START = ACT2_START + ACT2_DURATION;
  const ACT3_DURATION = 90; // 3s

  return (
    <AbsoluteFill className="bg-[#0a0c10]">
      <Background type="stars" starsCount={500} />
      
      {/* No global zoom - each act has its own rhythm */}
      <AbsoluteFill>
        {/* ===================================================================
            ACT 0: Problem - "Studying should be simple"
            =================================================================== */}
        <Sequence from={ACT0_START} durationInFrames={ACT0_DURATION}>
          <AbsoluteFill className="items-center justify-center">
            <ProfessionalText 
              text="Studium by mělo být jednoduché"
              type="problem"
              mode="refined"
            />
          </AbsoluteFill>
        </Sequence>

        {/* ===================================================================
            ACT 1: Question - "What if it only took three clicks?"
            =================================================================== */}
        <Sequence from={ACT1_START} durationInFrames={ACT1_DURATION}>
          <AbsoluteFill className="items-center justify-center">
            <ProfessionalText 
              text="Co kdyby stačily tři kliky?"
              type="question"
              mode="refined"
            />
          </AbsoluteFill>
        </Sequence>

        {/* ===================================================================
            ACT 2: Hero Feature - SubjectDrawer FilesHint (THE SOLUTION)
            10 seconds to demonstrate file download flow with professional animation
            =================================================================== */}
        <Sequence from={ACT2_START} durationInFrames={ACT2_DURATION}>
          <FilesHint 
            subject={{
              name: "Statistika",
              code: "STA",
              credits: "6 KREDITŮ",
              status: "POVINNÝ",
              completion: "Zkouška",
            }}
            animate={true}
            rotationX={25}
            rotationY={-15}
            depth={50}
            scale={2}
          />
        </Sequence>

        {/* ===================================================================
            ACT 3: Brand + Call-to-Action (Direct from hero)
            =================================================================== */}
        <Sequence from={ACT3_START} durationInFrames={ACT3_DURATION}>
          <BrandedEndSlide 
            logoScale={1.5}
            theme="dark"
            animate={true}
            ctaText="Link v biu"
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
