import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  spring,
  interpolate,
  useVideoConfig,
} from "remotion";
import { SearchBarComposition } from "../SearchBar/index";
import { SubjectDrawerComposition } from "../SubjectDrawer/index";
import { Background } from "../../components/Background";
import { BrandedEndSlide } from "../BrandedEndSlide";
import { KineticText } from "./components/KineticText";

const successRateData = {
  stats: [
    {
      semester: "ZS 25/26",
      totalPass: 651,
      totalFail: 195,
      type: "exam" as const,
      terms: [
        {
          grades: {
            A: 51, B: 80, C: 174, D: 183, E: 163, F: 32, FN: 163,
          },
        },
      ],
    },
    {
      semester: "ZS 24/25",
      totalPass: 528,
      totalFail: 194,
      type: "exam" as const,
      terms: [
        {
          grades: {
            A: 40, B: 59, C: 114, D: 117, E: 198, F: 50, FN: 144,
          },
        },
      ],
    },
    {
      semester: "ZS 23/24",
      totalPass: 460,
      totalFail: 279,
      type: "exam" as const,
      terms: [
        {
          grades: {
            A: 28, B: 44, C: 102, D: 109, E: 177, F: 71, FN: 208,
          },
        },
      ],
    },
    {
      semester: "LS 24/25",
      totalPass: 21,
      totalFail: 3,
      type: "exam" as const,
      terms: [{ grades: { A: 0, B: 0, C: 2, D: 1, E: 18, F: 0, FN: 3 } }],
    },
    {
      semester: "LS 23/24",
      totalPass: 25,
      totalFail: 4,
      type: "exam" as const,
      terms: [{ grades: { A: 0, B: 2, C: 4, D: 6, E: 13, F: 0, FN: 4 } }],
    },
  ],
};

export const ReelSearchBarStats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- TIMELINE (390 frames = 13s @ 30fps) ---
  // 0-260:    SearchBar demo (internal timeline drives typing/dropdown/select)
  // 10-50:    KineticText "Jaká je úspěšnost?"
  // 240-260:  SearchBar fades out
  // 250:      SubjectDrawer stats fades in (Sequence local frame 0)
  // 250-350:  Stats tab animates (bars, circles)
  // 340-355:  Stats fades out
  // 350-390:  BrandedEndSlide

  // --- SEARCHBAR PHASE ---
  const SEARCH_DURATION = 260;
  const SEARCH_FADE_START = 240;

  const searchFadeOut =
    frame >= SEARCH_FADE_START
      ? interpolate(frame, [SEARCH_FADE_START, SEARCH_FADE_START + 20], [1, 0], {
          extrapolateRight: "clamp",
        })
      : 1;

  // --- STATS PHASE ---
  const STATS_START = 250;
  const STATS_FADE_OUT = 355;

  const statsEntrance = spring({
    frame: frame - STATS_START,
    fps,
    config: { damping: 14, mass: 0.5 },
  });
  const statsScale = interpolate(statsEntrance, [0, 1], [1.2, 1.5]);
  const statsOpacity = interpolate(statsEntrance, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const statsFadeOut =
    frame >= STATS_FADE_OUT
      ? interpolate(frame, [STATS_FADE_OUT, STATS_FADE_OUT + 15], [1, 0], {
          extrapolateRight: "clamp",
        })
      : 1;

  // --- END CARD ---
  const END_CARD_START = 365;
  const showEndCard = frame >= END_CARD_START;
  const endCardOpacity = showEndCard
    ? interpolate(frame, [END_CARD_START, END_CARD_START + 10], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0c10" }}>
      <Background type="stars" starsCount={500} />

      {/* Phase 1: SearchBar — Sequence gives it local frame 0 for internal timeline */}
      <Sequence from={0} durationInFrames={SEARCH_DURATION}>
        <AbsoluteFill style={{ opacity: searchFadeOut }}>
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
            scale={1.8}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Phase 2: SubjectDrawer Stats — Sequence gives bars/circles local frame 0 */}
      <Sequence from={STATS_START} layout="none">
        <AbsoluteFill
          style={{
            opacity: statsOpacity * statsFadeOut,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SubjectDrawerComposition
            subject={{
              name: "Podniková ekonomika",
              code: "EBC-PE",
              credits: "6 KREDITŮ",
              status: "POVINNÝ",
              completion: "Zkouška",
            }}
            successRate={successRateData}
            activeTab="stats"
            animate={false}
            scale={statsScale}
            rotationX={0}
            rotationY={0}
            depth={0}
            progress={1}
            groups={[]}
            classmates={[]}
            activeSubTab="all"
            selectedIds={[]}
            downloadedIds={[]}
            tabOffset={0}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Kinetic text overlay */}
      <KineticText
        text="Jaká je úspěšnost? →"
        startFrame={10}
        duration={45}
        fontSize={56}
        top="25%"
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
