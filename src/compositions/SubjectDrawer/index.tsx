
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";

import { Background } from "../../components/Background";
import { SubjectDrawerHeader } from "../../components/SubjectDrawer/Header";
import { SubjectDrawerFileList } from "../../components/SubjectDrawer/Tabs/FileList";
import { SubjectDrawerSuccessRate } from "../../components/SubjectDrawer/Tabs/SuccessRate";
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
    rotationX: staticRotX = 0,
    rotationY: staticRotY = 0,
    depth: staticDepth = 0,
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

  const rotX = props.animate
    ? interpolate(frame, [0, 60], [15, staticRotX], { extrapolateRight: "clamp" })
    : staticRotX;

  const rotY = props.animate
    ? interpolate(frame, [0, 60], [-10, staticRotY], { extrapolateRight: "clamp" })
    : staticRotY;

  const entranceOpacity = interpolate(entrance, [0, 0.5], [0, 1]);
  const entranceY = interpolate(entrance, [0, 1], [40, 0]);
  const entranceScale = interpolate(entrance, [0, 1], [0.95, 1]);

  const shadowDepth = interpolate(rotX, [-45, 45], [20, -20]);
  const shadowBlur = Math.abs(rotX) + Math.abs(rotY) + 30;

  return (
    <AbsoluteFill className="overflow-hidden" style={{ perspective: "1200px" }}>
      {background && <Background {...background} />}
      
      {/* Audio for scripted selection */}
      {scriptedSelection && (
        <Audio src={staticFile("kenney_ui-audio/Audio/click1.ogg")} startFrom={30} volume={0.5} />
      )}

      <div 
        className="w-full h-full flex items-center justify-center p-12"
        style={{ backgroundColor: "transparent" }}
      >
        <div 
          className="w-[600px] h-[450px] bg-[#1a1f26] rounded-3xl border border-white/5 flex flex-col relative"
          style={{
            opacity: entranceOpacity,
            transformStyle: "preserve-3d",
            transform: `scale(${scale * entranceScale}) translateY(${entranceY}px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${staticDepth}px)`,
            boxShadow: `
              ${-rotY / 2}px ${shadowDepth}px ${shadowBlur}px rgba(0,0,0,0.5),
              0 0 60px rgba(0,0,0,0.2)
            `,
          }}
        >
          {/* 3D Extrusion Layers */}
          <div 
            className="absolute inset-0 rounded-3xl bg-black border border-white/5"
            style={{ transform: "translateZ(-6px)" }}
          />
          <div 
            className="absolute inset-0 rounded-3xl bg-black/60"
            style={{ transform: "translateZ(-12px)" }}
          />

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
      </div>
    </AbsoluteFill>
  );
};
