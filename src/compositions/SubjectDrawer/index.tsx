import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";

import { Background } from "../../components/Background";
import { SubjectDrawerHeader } from "../../components/SubjectDrawer/Header";
import { SubjectDrawerFileList } from "../../components/SubjectDrawer/Tabs/FileList";
import { SubjectDrawerSuccessRate } from "../../components/SubjectDrawer/Tabs/SuccessRate";
import { MendeluEnvironment } from "../../Environment";
import { SoundEffect } from "../../components/SoundEffect";
import { type SubjectDrawerProps } from "./schema";

export const SubjectDrawerComposition: React.FC<SubjectDrawerProps & { children?: React.ReactNode }> = (props) => {
  const {
    subject,
    groups = [],
    successRate,
    activeTab = "files",
    background,
    scale = 1,
    selectedIds = [],
    downloadedIds = [],
    scriptedSelection = false,
    isDone = false,
    children,
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
        <Sequence from={0}>
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
          />

          <div className="flex-1 overflow-hidden bg-black/10 rounded-b-3xl">
            {activeTab === "files" && (
                <SubjectDrawerFileList 
                    groups={groups}
                    selectedIds={effectiveSelectedIds}
                    downloadedIds={downloadedIds}
                />
            )}
            {activeTab === "stats" && (
                <SubjectDrawerSuccessRate successRate={successRate} />
            )}
          </div>
        </div>
        {children}
      </MendeluEnvironment>
    </AbsoluteFill>
  );
};
