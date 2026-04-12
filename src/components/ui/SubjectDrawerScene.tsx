import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, interpolate, useVideoConfig } from "remotion";
import { SubjectDrawerComposition } from "../../compositions/SubjectDrawer/index";
import { ActionProps } from "../../schemas/director";

export const SubjectDrawerScene: React.FC<NonNullable<ActionProps['subjectProps']>> = ({
  subjectName,
  subjectCode,
  activeTab,
  selectedFileIndices = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Subject data
  const subject = {
    name: subjectName,
    code: subjectCode,
    credits: "6 KREDITŮ",
    status: "POVINNÝ",
    completion: "Zkouška",
    garant: "doc. Ing. Oldřich Trenz, Ph.D.",
    vyucujici: [],
  };

  const files = [
    { file_name: "Cvičení 1", link: "c1" },
    { file_name: "Cvičení 2", link: "c2" },
    { file_name: "Harmonogram", link: "h1" },
    { file_name: "Přednáška 1", link: "p1" },
    { file_name: "Přednáška 2", link: "p2" },
  ];
  const groups = [{ name: "ostatni", displayName: "OSTATNÍ", files }];

  const successRateData = {
    stats: [
      {
        semester: "ZS 25/26",
        totalPass: 651,
        totalFail: 195,
        type: "exam" as const,
        terms: [{ grades: { A: 51, B: 80, C: 174, D: 183, E: 163, F: 32, FN: 163 } }],
      },
    ],
  };

  // 2. Relative Animation Math (Prevents Brittle Numbers)
  // Instead of frame >= 30, we use relative frame progress
  const entranceSpring = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const drawerScale = interpolate(entranceSpring, [0, 1], [1.2, 1.5]);

  // Interaction logic based on indices
  const selectedIds: string[] = [];
  selectedFileIndices.forEach((idx, i) => {
     // Spread selections over the first half of the sequence
     const triggerFrame = 20 + i * 20; 
     if (frame >= triggerFrame) selectedIds.push(files[idx]?.link);
  });

  return (
    <AbsoluteFill className="flex items-center justify-center">
      <SubjectDrawerComposition
        subject={subject}
        groups={groups}
        successRate={successRateData}
        activeTab={activeTab}
        animate={false}
        scale={drawerScale}
        selectedIds={selectedIds}
        downloadedIds={[]}
        downloadProgress={{}}
        buttonState={selectedIds.length > 0 ? "ready" : "hidden"}
        isDone={false}
        rotationX={0}
        rotationY={0}
        depth={0}
        progress={1}
        activeSubTab="all"
        classmates={[]}
        tabOffset={0}
        completionFrames={[]}
        folderEntranceFrame={999}
        folderCelebrationFrame={999}
      />
    </AbsoluteFill>
  );
};
