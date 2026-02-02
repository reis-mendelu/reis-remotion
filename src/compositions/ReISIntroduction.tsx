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
  // TIMELINE: 19 seconds @ 30fps = 570 frames (extended for full FilesHint)
  // ============================================================================
  
  // ACT 0: Problem Setup (2.5s)
  const ACT0_START = 0;
  const ACT0_DURATION = 75; // 2.5s
  
  // ACT 1: Question Hook (1.5s)
  const ACT1_START = ACT0_START + ACT0_DURATION;
  const ACT1_DURATION = 45; // 1.5s
  
  // ACT 2: Hero Feature - SubjectDrawer (10s) - Full FilesHint animation
  const ACT2_START = ACT1_START + ACT1_DURATION;
  const ACT2_DURATION = 300; // 10s (full FilesHint animation)
  
  // ACT 3: Payoff Statement (2s)
  const ACT3_START = ACT2_START + ACT2_DURATION;
  const ACT3_DURATION = 60; // 2s
  
  // ACT 4: Brand + CTA (3s)
  const ACT4_START = ACT3_START + ACT3_DURATION;
  const ACT4_DURATION = 90; // 3s

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
              name: "Algoritmizace",
              code: "ALG",
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
            ACT 3: Payoff - "MODERNIZOVANÝ reIS" (The Aha! Moment)
            =================================================================== */}
        <Sequence from={ACT3_START} durationInFrames={ACT3_DURATION}>
          <AbsoluteFill className="items-center justify-center">
            <ProfessionalText 
              text="MODERNIZOVANÝ reIS"
              type="headline"
              mode="minimalist"
            />
          </AbsoluteFill>
        </Sequence>

        {/* ===================================================================
            ACT 4: Brand + Call-to-Action
            =================================================================== */}
        <Sequence from={ACT4_START} durationInFrames={ACT4_DURATION}>
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
