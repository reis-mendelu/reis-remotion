import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { ProfessionalText } from "../../components/ProfessionalText";
import { Background } from "../../components/Background";
import { SearchBarComposition } from "./index";
import { SuccessRateHint } from "../SubjectDrawer/SuccessRateHint";
import { BrandedEndSlide } from "../BrandedEndSlide";

/**
 * SearchBar Introduction: Emotional Narrative Arc
 * Problem: comparing success rates of elective subjects is painful
 * Solution: just start typing → find subject → see its success rate instantly
 */
export const SearchBarIntroduction: React.FC = () => {
  // ============================================================================
  // TIMELINE: ~23.7s @ 30fps = 710 frames
  // ============================================================================

  // ACT 0: Problem (2.5s)
  const ACT0_START = 0;
  const ACT0_DURATION = 75;

  // ACT 1: Question Hook (1.5s)
  const ACT1_START = ACT0_START + ACT0_DURATION;
  const ACT1_DURATION = 45;

  // ACT 2: SearchBar demo (8.7s — 260 frames of animation)
  const ACT2_START = ACT1_START + ACT1_DURATION;
  const ACT2_DURATION = 260;

  // Crossfade: SuccessRate fades in over the last 20f of SearchBar
  const FADE_START = ACT2_START + ACT2_DURATION - 20;

  // ACT 3: SuccessRate (8s)
  const ACT3_START = FADE_START;
  const ACT3_DURATION = 240;

  // ACT 4: BrandedEndSlide (3s)
  const ACT4_START = ACT3_START + ACT3_DURATION;
  const ACT4_DURATION = 90;

  const FadeInWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
    return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
  };

  return (
    <AbsoluteFill className="bg-[#0a0c10]">
      <Background type="stars" starsCount={500} />

      <AbsoluteFill>
        {/* ===================================================================
            ACT 0: Problem
            =================================================================== */}
        <Sequence from={ACT0_START} durationInFrames={ACT0_DURATION}>
          <AbsoluteFill className="items-center justify-center">
            <ProfessionalText
              text="Porovnáš úspěšnosti povinně volitelných předmětů?"
              type="problem"
              mode="refined"
            />
          </AbsoluteFill>
        </Sequence>

        {/* ===================================================================
            ACT 1: Question Hook
            =================================================================== */}
        <Sequence from={ACT1_START} durationInFrames={ACT1_DURATION}>
          <AbsoluteFill className="items-center justify-center">
            <ProfessionalText
              text="Co kdyby stačilo začít psát?"
              type="question"
              mode="refined"
            />
          </AbsoluteFill>
        </Sequence>

        {/* ===================================================================
            ACT 2: SearchBar demo
            =================================================================== */}
        <Sequence from={ACT2_START} durationInFrames={ACT2_DURATION}>
          <SearchBarComposition
            query="podnikova ekonomi"
            results={[
              { id: "1", title: "Podniková ekonomika", type: "subject", detail: "D-PODEK · ZF", subjectCode: "D-PODEK" },
              { id: "2", title: "Podniková ekonomika", type: "subject", detail: "EKO · ZS 2025/2026 · AF", subjectCode: "EKO" },
              { id: "3", title: "Podniková ekonomika", type: "subject", detail: "RRPEK · LS 2025/2026 · FRRMS", subjectCode: "RRPEK" },
              { id: "4", title: "Podniková ekonomika", type: "subject", detail: "EKO · LS 2025/2026 · AF", subjectCode: "EKO" },
              { id: "5", title: "Podniková ekonomika 1", type: "subject", detail: "EBC-PE · ZS 2025/2026 · PEF", subjectCode: "EBC-PE" },
            ]}
            selectedResultIndex={4}
            scale={2}
          />
        </Sequence>

        {/* ===================================================================
            ACT 3: SuccessRate — fades in over last 20f of SearchBar
            =================================================================== */}
        <Sequence from={ACT3_START} durationInFrames={ACT3_DURATION}>
          <FadeInWrapper>
            <SuccessRateHint
              subject={{
                name: "Podniková ekonomika",
                code: "EBC-PE",
                credits: "6 KREDITŮ",
                status: "POVINNÝ",
                completion: "Zkouška",
              }}
              scale={2}
              animate={true}
              background={{ type: "stars", starsCount: 500 }}
              rotationX={25}
              rotationY={-15}
              depth={50}
              groups={[]}
              activeTab="stats"
              activeSubTab="all"
              progress={1}
              selectedIds={[]}
              downloadedIds={[]}
              classmates={[]}
              tabOffset={0}
            />
          </FadeInWrapper>
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
