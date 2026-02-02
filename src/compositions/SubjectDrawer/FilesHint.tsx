import React from "react";
import { useCurrentFrame, Sequence } from "remotion";
import { SubjectDrawerComposition } from "./index";
import { SoundEffect } from "../../components/SoundEffect";
import { type SubjectDrawerProps } from "./schema";

export const FilesHint: React.FC<SubjectDrawerProps> = (props) => {
  const frame = useCurrentFrame();

  // Subject Data for Algoritmizace
  const subject = {
    name: "Algoritmizace",
    code: "ALG",
    credits: "6 KREDITŮ",
    status: "POVINNÝ",
    completion: "Zkouška",
    garant: "doc. Ing. Oldřich Trenz, Ph.D.",
    vyucujici: [
      { name: "doc. Dr. Ing. Jiří Rybička", roles: "přednášející" },
      { name: "doc. Ing. Oldřich Trenz, Ph.D.", roles: "garant" },
      { name: "Ing. Pavel Turčínek, Ph.D.", roles: "cvičící" }
    ]
  };

  const files = [
    { file_name: "Cvičení 3 Programování sekvence a větvení", link: "c3" },
    { file_name: "Cvičení 4 -- cykly elementární algoritmy", link: "c4" },
    { file_name: "Harmonogram výuky a podmínky ukončení", link: "h1" },
    { file_name: "Pracovní listy 1 a 2 -- Vývojové diagramy (1)", link: "p1", file_comment: "Inspirace pro první cvičení" },
    { file_name: "Pracovní listy 1 a 2 -- Vývojové diagramy (2)", link: "p2" }
  ];

  const groups = [{ name: "ostatni", displayName: "OSTATNÍ", files }];

  // --- ORCHESTRATION: 4-PHASE ANIMATION (270 frames @ 30fps = 9 seconds) ---
  
  // PHASE 1: SELECTION (0-100 frames, 0-3.3s)
  // Sequential checkbox selection with 15-frame delays
  const selectedIds: string[] = [];
  if (frame >= 20) selectedIds.push("c3");   // Frame 20 (0.67s)
  if (frame >= 35) selectedIds.push("c4");   // Frame 35 (1.17s)
  if (frame >= 50) selectedIds.push("h1");   // Frame 50 (1.67s)

  // PHASE 2: BUTTON (56-106 frames, 1.9-3.5s)
  let buttonState: 'hidden' | 'ready' | 'clicking' | 'downloading' | 'complete' = 'hidden';
  if (frame >= 56 && frame < 96) buttonState = 'ready';       // Button appears (40 frames to comprehend)
  if (frame >= 96 && frame < 106) buttonState = 'clicking';    // Click animation
  if (frame >= 106 && frame < 166) buttonState = 'downloading'; // Downloading state
  if (frame >= 166) buttonState = 'complete';                   // Success state

  // PHASE 3: PROGRESS (106-166 frames, 3.5-5.5s)
  // Sequential downloads: 20 frames per file (0.67 seconds each) - Quick demo
  const downloadProgress: Record<string, number> = {};
  
  // File 1: Frames 106-126 (3.5-4.2s)
  if (frame >= 106 && frame < 126) {
    downloadProgress["c3"] = Math.min((frame - 106) / 20, 1);
  } else if (frame >= 126) {
    downloadProgress["c3"] = 1;
  }
  
  // File 2: Frames 126-146 (4.2-4.9s)
  if (frame >= 126 && frame < 146) {
    downloadProgress["c4"] = Math.min((frame - 126) / 20, 1);
  } else if (frame >= 146) {
    downloadProgress["c4"] = 1;
  }
  
  // File 3: Frames 146-166 (4.9-5.5s)
  if (frame >= 146 && frame < 166) {
    downloadProgress["h1"] = Math.min((frame - 146) / 20, 1);
  } else if (frame >= 166) {
    downloadProgress["h1"] = 1;
  }

  // PHASE 4: COMPLETION (166-240 frames, 5.5-8s)
  // Downloaded state triggers celebration animations in FileList
  const downloadedIds: string[] = [];
  if (frame >= 166) downloadedIds.push("c3"); // Frame 166
  if (frame >= 176) downloadedIds.push("c4"); // Frame 176 (+10 frame stagger)
  if (frame >= 186) downloadedIds.push("h1"); // Frame 186 (+10 frame stagger)

  const isDone = frame >= 186;

  return (
    <SubjectDrawerComposition
      {...props}
      subject={subject}
      groups={groups}
      activeTab="files"
      selectedIds={selectedIds}
      downloadedIds={downloadedIds}
      downloadProgress={downloadProgress}
      buttonState={buttonState}
      isDone={isDone}
    >
      {/* Audio Tracks - Sequential Selection */}
      <Sequence from={20}>
          <SoundEffect type="TOGGLE_ON" volume={0.3} />
      </Sequence>
      <Sequence from={35}>
          <SoundEffect type="TOGGLE_ON" volume={0.3} />
      </Sequence>
      <Sequence from={50}>
          <SoundEffect type="TOGGLE_ON" volume={0.3} />
      </Sequence>
      
      {/* Button Click */}
      <Sequence from={96}>
          <SoundEffect type="TOGGLE_ON" volume={0.4} />
      </Sequence>
      
      {/* Completion Celebrations (staggered) */}
      <Sequence from={166}>
          <SoundEffect type="SUCCESS" volume={0.4} />
      </Sequence>
      <Sequence from={176}>
          <SoundEffect type="SUCCESS" volume={0.3} />
      </Sequence>
      <Sequence from={186}>
          <SoundEffect type="SUCCESS" volume={0.5} />
      </Sequence>
    </SubjectDrawerComposition>
  );
};
