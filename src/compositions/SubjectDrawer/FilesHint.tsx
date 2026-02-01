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

  // --- ORCHESTRATION ---
  // Frame 30: Selection Trigger
  const selectedIds = frame >= 30 ? ["c3", "c4", "h1"] : [];

  // Downloaded State (Completion rhythm: Frame 50, 70, 90)
  const downloadedIds: string[] = [];
  if (frame >= 50) downloadedIds.push("c3");
  if (frame >= 70) downloadedIds.push("c4");
  if (frame >= 90) downloadedIds.push("h1");

  // Done State
  const isDone = frame >= 100;

  return (
    <SubjectDrawerComposition
      {...props}
      subject={subject}
      groups={groups}
      activeTab="files"
      selectedIds={selectedIds}
      downloadedIds={downloadedIds}
      isDone={isDone}
    >
      {/* Audio Tracks */}
      <Sequence from={30}>
          <SoundEffect type="TOGGLE_ON" volume={0.4} />
      </Sequence>
      
      {/* Rhythmic Success Pings */}
      <Sequence from={80}>
          <SoundEffect type="SUCCESS" volume={0.3} />
      </Sequence>
      <Sequence from={100}>
          <SoundEffect type="SUCCESS" volume={0.3} />
      </Sequence>
      <Sequence from={120}>
          <SoundEffect type="SUCCESS" volume={0.3} />
      </Sequence>
    </SubjectDrawerComposition>
  );
};
