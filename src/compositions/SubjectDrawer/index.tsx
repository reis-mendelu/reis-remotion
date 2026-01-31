import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MendeluEnvironment } from "../../Environment";
import { Background } from "../../components/Background";
import { SubjectDrawerHeader } from "../../components/SubjectDrawer/Header";
import { SubjectDrawerFileList } from "../../components/SubjectDrawer/Tabs/FileList";
import { SubjectDrawerSyllabus } from "../../components/SubjectDrawer/Tabs/Syllabus";
import { SubjectDrawerSuccessRate } from "../../components/SubjectDrawer/Tabs/SuccessRate";
import { SubjectDrawerSchema, type SubjectDrawerProps } from "./schema";

export const SubjectDrawerComposition: React.FC<SubjectDrawerProps> = (props) => {
  const {
    subject,
    groups = [],
    syllabus,
    successRate,
    activeTab = "files",
    background,
    scale = 1,
    selectedIds = [],
    downloadedIds = [],
  } = props;

  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 20 },
  });

  const entranceOpacity = interpolate(entrance, [0, 0.5], [0, 1]);
  const entranceY = interpolate(entrance, [0, 1], [40, 0]);
  const entranceScale = interpolate(entrance, [0, 1], [0.95, 1]);

  return (
    <AbsoluteFill className="overflow-hidden">
      {background && <Background {...background} />}
      
      <MendeluEnvironment 
        className="w-full h-full flex items-center justify-center p-12"
        style={{ backgroundColor: "transparent" }}
      >
        <div 
          className="w-[600px] h-[800px] bg-[#1f2937] rounded-3xl border border-white/5 overflow-hidden flex flex-col shadow-2xl"
          style={{
            opacity: entranceOpacity,
            transform: `scale(${scale * entranceScale}) translateY(${entranceY}px)`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}
        >
          <SubjectDrawerHeader 
            subject={subject}
            activeTab={activeTab}
            totalFiles={groups.reduce((acc, g) => acc + g.files.length, 0)}
          />

          <div className="flex-1 overflow-y-auto bg-[#1e2329]/30">
            {activeTab === "files" && (
                <SubjectDrawerFileList 
                    groups={groups}
                    selectedIds={selectedIds}
                    downloadedIds={downloadedIds}
                />
            )}
            {activeTab === "syllabus" && (
                <SubjectDrawerSyllabus syllabus={syllabus} />
            )}
            {activeTab === "stats" && (
                <SubjectDrawerSuccessRate successRate={successRate} />
            )}
          </div>
        </div>
      </MendeluEnvironment>
    </AbsoluteFill>
  );
};
