import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";

import { Background } from "../../components/Background";
import { SubjectDrawerHeader } from "../../components/SubjectDrawer/Header";
import { SubjectDrawerFileList } from "../../components/SubjectDrawer/Tabs/FileList";
import { SubjectDrawerSuccessRate } from "../../components/SubjectDrawer/Tabs/SuccessRate";
import { SubjectDrawerClassmates } from "../../components/SubjectDrawer/Tabs/Classmates";
import { SubjectDrawerSyllabus } from "../../components/SubjectDrawer/Tabs/Syllabus";
import { DownloadFolder } from "../../components/SubjectDrawer/DownloadFolder";
import { MendeluEnvironment } from "../../Environment";
import { SoundEffect } from "../../components/SoundEffect";
import { type SubjectDrawerProps } from "./schema";

interface SubjectDrawerCompositionProps extends SubjectDrawerProps {
  children?: React.ReactNode;
  completionFrames?: number[];
  folderEntranceFrame?: number;
  folderCelebrationFrame?: number;
}

export const SubjectDrawerComposition: React.FC<SubjectDrawerCompositionProps> = (props) => {
  const {
    subject,
    groups = [],
    successRate,
    syllabus,
    classmates,
    activeTab = "files",
    background,
    scale = 1,
    selectedIds = [],
    downloadedIds = [],
    downloadProgress,
    buttonState,
    scriptedSelection = false,
    tabOffset = 0,
    isDone = false,
    children,
    completionFrames,
    folderEntranceFrame,
    folderCelebrationFrame,
  } = props;

  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Scripted Selection Logic
  let effectiveSelectedIds = selectedIds;
  if (scriptedSelection) {
    if (frame < 30) {
      effectiveSelectedIds = [];
    } else if (frame < 60) {
      effectiveSelectedIds = ["l1", "l2", "l3"];
    }
  }

  const entrance = spring({
    frame,
    fps,
    config: { damping: 20 },
  });

  // Apple-style: Simple 2D entrance only
  const entranceOpacity = interpolate(entrance, [0, 0.5], [0, 1]);
  const entranceY = interpolate(entrance, [0, 1], [20, 0]);

  return (
    <AbsoluteFill className="overflow-hidden">
      {background && <Background {...background} />}

      {/* Audio for scripted selection / entrance */}
      {props.animate && (
        <Sequence>
          <SoundEffect type="SWOOSH" volume={0.6} />
        </Sequence>
      )}

      <MendeluEnvironment
        className="w-full h-full flex items-center justify-center p-12"
        style={{ backgroundColor: "transparent" }}
      >
        <div
          className="w-[600px] h-[450px] bg-[#1a1f26] rounded-3xl border border-white/5 flex flex-col relative"
          style={{
            opacity: entranceOpacity,
            transform: `scale(${scale}) translateY(${entranceY}px)`, // Apple-style: Simple 2D only
            boxShadow: `0 20px 60px rgba(0,0,0,0.3)`, // Subtle depth, no dynamic shadows
          }}
        >
          {/* No 3D extrusion layers - clean and simple */}

          <SubjectDrawerHeader
            subject={subject}
            selectedCount={effectiveSelectedIds.length}
            isDone={isDone}
            buttonState={buttonState}
            activeTab={activeTab}
          />

          <div
            className="flex-1 overflow-hidden bg-[#1a1f26] rounded-b-3xl"
          >
            <div
              className="w-full h-full"
              style={{
                opacity: interpolate(frame - tabOffset, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
                transform: `translateY(${interpolate(frame - tabOffset, [0, 15], [5, 0], { extrapolateRight: 'clamp' })}px)`,
              }}
            >
              {activeTab === "files" && (
                <Sequence from={tabOffset} layout="none">
                  <SubjectDrawerFileList
                    groups={groups}
                    selectedIds={effectiveSelectedIds}
                    downloadedIds={downloadedIds}
                    downloadProgress={downloadProgress}
                    completionFrames={completionFrames}
                  />
                </Sequence>
              )}
              {activeTab === "stats" && (
                <Sequence from={tabOffset} layout="none">
                  <SubjectDrawerSuccessRate successRate={successRate} />
                </Sequence>
              )}
              {activeTab === "syllabus" && (
                <Sequence from={tabOffset} layout="none">
                  <SubjectDrawerSyllabus syllabus={syllabus} />
                </Sequence>
              )}
              {activeTab === "classmates" && (
                <Sequence from={tabOffset} layout="none">
                  <SubjectDrawerClassmates
                    classmates={classmates}
                    activeSubTab={props.activeSubTab as any}
                  />
                </Sequence>
              )}
            </div>
          </div>

          {/* Download Folder - Bottom-right indicator */}
          <DownloadFolder
            downloadedCount={downloadedIds.length}
            totalCount={selectedIds.length}
            isVisible={buttonState === 'downloading' || buttonState === 'complete'}
            isComplete={isDone}
            entranceFrame={folderEntranceFrame}
            celebrationFrame={folderCelebrationFrame}
          />
        </div>
        {children}
      </MendeluEnvironment>
    </AbsoluteFill>
  );
};
