import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, spring, interpolate, useVideoConfig } from "remotion";
import { SubjectDrawerComposition } from "../SubjectDrawer/index";
import { SoundEffect } from "../../components/SoundEffect";
import { Background } from "../../components/Background";
import { BrandedEndSlide } from "../BrandedEndSlide";
import { KineticText } from "./components/KineticText";

export const ReelSubjectDrawerFiles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subject = {
    name: "Statistika",
    code: "STA",
    credits: "6 KREDITŮ",
    status: "POVINNÝ",
    completion: "Zkouška",
    garant: "doc. Ing. Oldřich Trenz, Ph.D.",
    vyucujici: [
      { name: "doc. Dr. Ing. Jiří Rybička", roles: "přednášející" },
      { name: "doc. Ing. Oldřich Trenz, Ph.D.", roles: "garant" },
      { name: "Ing. Pavel Turčínek, Ph.D.", roles: "cvičící" },
    ],
  };

  const files = [
    { file_name: "Cvičení 1", link: "c1" },
    { file_name: "Cvičení 2", link: "c2" },
    { file_name: "Harmonogram", link: "h1" },
    { file_name: "Přednáška 1", link: "p1" },
    { file_name: "Přednáška 2", link: "p2" },
  ];

  const groups = [{ name: "ostatni", displayName: "OSTATNÍ", files }];

  // --- ENTRANCE (0-20): SubjectDrawer springs in ---
  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.5 },
  });
  // 600px * 1.5 = 900px → fits in 1080px with padding
  const drawerScale = interpolate(entranceSpring, [0, 1], [1.2, 1.5]);
  const drawerOpacity = interpolate(entranceSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  // --- INTERACTION (20-150): Checkbox selection ---
  const selectedIds: string[] = [];
  if (frame >= 30) selectedIds.push("c1");
  if (frame >= 50) selectedIds.push("c2");
  if (frame >= 70) selectedIds.push("h1");

  // --- DOWNLOAD (150-230): Button + progress ---
  let buttonState: "hidden" | "ready" | "clicking" | "downloading" | "complete" = "hidden";
  if (frame >= 80 && frame < 120) buttonState = "ready";
  if (frame >= 120 && frame < 130) buttonState = "clicking";
  if (frame >= 130 && frame < 210) buttonState = "downloading";
  if (frame >= 210) buttonState = "complete";

  const downloadProgress: Record<string, number> = {};
  if (frame >= 130 && frame < 157) {
    downloadProgress["c1"] = Math.min((frame - 130) / 27, 1);
  } else if (frame >= 157) {
    downloadProgress["c1"] = 1;
  }
  if (frame >= 157 && frame < 184) {
    downloadProgress["c2"] = Math.min((frame - 157) / 27, 1);
  } else if (frame >= 184) {
    downloadProgress["c2"] = 1;
  }
  if (frame >= 184 && frame < 210) {
    downloadProgress["h1"] = Math.min((frame - 184) / 26, 1);
  } else if (frame >= 210) {
    downloadProgress["h1"] = 1;
  }

  // --- COMPLETION (210+): Files fly to folder ---
  const downloadedIds: string[] = [];
  if (frame >= 157) downloadedIds.push("c1");
  if (frame >= 184) downloadedIds.push("c2");
  if (frame >= 210) downloadedIds.push("h1");

  const isDone = frame >= 210;

  // End card phase (240-300) — needs 60 frames so CTA text (internal frame 30-50) is visible
  const showEndCard = frame >= 240;
  const endCardOpacity = showEndCard
    ? interpolate(frame, [240, 250], [0, 1], { extrapolateRight: "clamp" })
    : 0;

  // Fade out drawer before end card
  const drawerFadeOut = frame >= 230
    ? interpolate(frame, [230, 245], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0c10" }}>
      <Background type="stars" starsCount={500} />

      {/* Main drawer demo */}
      <AbsoluteFill
        style={{
          opacity: drawerOpacity * drawerFadeOut,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SubjectDrawerComposition
          subject={subject}
          groups={groups}
          activeTab="files"
          animate={false}
          scale={drawerScale}
          selectedIds={selectedIds}
          downloadedIds={downloadedIds}
          downloadProgress={downloadProgress}
          buttonState={buttonState}
          isDone={isDone}
          rotationX={0}
          rotationY={0}
          depth={0}
          progress={1}
          activeSubTab="all"
          classmates={[]}
          tabOffset={0}
          completionFrames={[157, 184, 210]}
          folderEntranceFrame={130}
          folderCelebrationFrame={210}
        >
          {/* Entrance swoosh */}
          <Sequence>
            <SoundEffect type="SWOOSH" volume={0.5} />
          </Sequence>

          {/* Checkbox selections */}
          <Sequence from={30}>
            <SoundEffect type="TOGGLE_ON" volume={0.3} />
          </Sequence>
          <Sequence from={50}>
            <SoundEffect type="TOGGLE_ON" volume={0.3} />
          </Sequence>
          <Sequence from={70}>
            <SoundEffect type="TOGGLE_ON" volume={0.3} />
          </Sequence>

          {/* Button click */}
          <Sequence from={120}>
            <SoundEffect type="TOGGLE_ON" volume={0.4} />
          </Sequence>

          {/* Download completions */}
          <Sequence from={157}>
            <SoundEffect type="SUCCESS" volume={0.4} />
          </Sequence>
          <Sequence from={184}>
            <SoundEffect type="SUCCESS" volume={0.3} />
          </Sequence>
          <Sequence from={210}>
            <SoundEffect type="SUCCESS" volume={0.5} />
          </Sequence>
        </SubjectDrawerComposition>
      </AbsoluteFill>

      {/* Kinetic text overlay */}
      <KineticText text="3 kliky →" startFrame={10} duration={45} fontSize={64} />

      {/* End card */}
      {showEndCard && (
        <AbsoluteFill style={{ opacity: endCardOpacity }}>
          <Sequence from={240} layout="none">
            <BrandedEndSlide logoScale={1.0} theme="dark" animate={true} ctaText="Link v biu" />
          </Sequence>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
