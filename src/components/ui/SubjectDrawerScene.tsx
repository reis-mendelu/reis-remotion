import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, spring, interpolate, useVideoConfig } from "remotion";
import { SubjectDrawerComposition } from "../../compositions/SubjectDrawer/index";
import { ActionProps } from "../../schemas/director";

export const SubjectDrawerScene: React.FC<NonNullable<ActionProps['subjectProps']>> = ({
  subjectName,
  subjectCode,
  activeTab,
  selectedFileIndices = [],
  files = [],
  successRate,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Subject data (Memoized to prevent re-creation)
  const subject = useMemo(() => ({
    name: subjectName,
    code: subjectCode,
    credits: "6 KREDITŮ",
    status: "POVINNÝ",
    completion: "Zkouška",
    garant: "doc. Ing. Oldřich Trenz, Ph.D.",
    vyucujici: [],
  }), [subjectName, subjectCode]);

  const groups = useMemo(() => [{ 
    name: "ostatni", 
    displayName: "OSTATNÍ", 
    files 
  }], [files]);

  // 2. Relative Animation Logic (Scale with duration)
  const entranceSpring = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const drawerScale = interpolate(entranceSpring, [0, 1], [1.2, 1.5]);

  // Interaction logic using percentages (0.3 to 0.8 of the sequence)
  const selectionStartPct = 0.3;
  const selectionEndPct = 0.8;
  const totalSlots = selectedFileIndices.length;

  const selectedIds: string[] = useMemo(() => {
    const ids: string[] = [];
    selectedFileIndices.forEach((idx, i) => {
       const relativePct = selectionStartPct + (i / Math.max(1, totalSlots - 1)) * (selectionEndPct - selectionStartPct);
       const triggerFrame = Math.floor(durationInFrames * relativePct);
       if (frame >= triggerFrame) ids.push(files[idx]?.link);
    });
    return ids;
  }, [selectedFileIndices, files, durationInFrames, frame, totalSlots]);

  return (
    <AbsoluteFill className="flex items-center justify-center">
      <SubjectDrawerComposition
        subject={subject}
        groups={groups}
        successRate={successRate as any}
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
