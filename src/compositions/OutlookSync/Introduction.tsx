import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ProfessionalText } from "../../components/ProfessionalText";
import { Background } from "../../components/Background";
import { OutlookSyncHint } from "../../components/OutlookSync/Hint";
import { WeeklyCalendar } from "../../components/reis/WeeklyCalendar";
import { BrandedEndSlide } from "../BrandedEndSlide";

/**
 * OutlookSync Introduction: Emotional Narrative Arc
 */
export const OutlookSyncIntroduction: React.FC = () => {
  // ============================================================================
  // TIMELINE: 15.5 seconds @ 30fps = 465 frames
  // ============================================================================
  
  // ACT 0: Problem Setup (2.5s)
  const ACT0_START = 0;
  const ACT0_DURATION = 75; // 2.5s
  
  // ACT 1: Question Hook (1.5s)
  const ACT1_START = ACT0_START + ACT0_DURATION;
  const ACT1_DURATION = 45; // 1.5s
  
  // ACT 2: Hero Feature - Outlook Sync (4s)
  const ACT2_START = ACT1_START + ACT1_DURATION;
  const ACT2_DURATION = 120; // 4s
  
  // ACT 3: Brand + CTA (3s)
  const ACT3_START = ACT2_START + ACT2_DURATION;
  const ACT3_DURATION = 90; // 3s

  return (
    <AbsoluteFill className="bg-[#0a0c10]">
      <Background type="stars" starsCount={500} />
      
      <AbsoluteFill>
        {/* ===================================================================
            ACT 0: Problem - "Tired of manual scheduling?"
            =================================================================== */}
        <Sequence from={ACT0_START} durationInFrames={ACT0_DURATION}>
          <AbsoluteFill className="items-center justify-center">
            <ProfessionalText 
              text="Už tě nebaví opisovat rozvrh?"
              type="problem"
              mode="refined"
            />
          </AbsoluteFill>
        </Sequence>

        {/* ===================================================================
            ACT 1: Question - "What if it synced itself?"
            =================================================================== */}
        <Sequence from={ACT1_START} durationInFrames={ACT1_DURATION}>
          <AbsoluteFill className="items-center justify-center">
            <ProfessionalText 
              text="Co kdyby se tvůj kalendář plnil sám?"
              type="question"
              mode="refined"
            />
          </AbsoluteFill>
        </Sequence>


        {/* ===================================================================
            ACT 2: Hero Feature - Outlook Sync Transition (4s)
            =================================================================== */}
        <Sequence from={ACT2_START} durationInFrames={ACT2_DURATION}>
           <OutlookSyncHint 
             scale={2}
           />
        </Sequence>

        {/* ===================================================================
            ACT 2.5: Weekly Calendar (4s)
            =================================================================== */}
        <Sequence from={ACT2_START + ACT2_DURATION} durationInFrames={120}>
           <WeeklyCalendar />
        </Sequence>

        {/* ===================================================================
            ACT 3: Brand + Call-to-Action
            =================================================================== */}
        <Sequence from={ACT3_START + 120} durationInFrames={ACT3_DURATION}>
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
