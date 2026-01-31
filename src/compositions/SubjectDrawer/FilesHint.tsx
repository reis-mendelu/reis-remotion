import React from "react";
import { useVideoConfig } from "remotion";
import { SubjectDrawerComposition } from "./index";
import { BrandedCursor } from "../../components/SubjectDrawer/BrandedCursor";

export const FilesHint: React.FC = () => {
  const { width, height } = useVideoConfig();

  // Subject Data for Algoritmizace (The "Heavy Signal")
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

  // Static Selection: Precisely 3 files selected as directed
  const selectedIds = ["c3", "c4", "h1"];

  // Idle Cursor Position (Bottom Right, out of the way but visible for branding)
  const cursorX = width * 0.9;
  const cursorY = height * 0.9;

  return (
    <SubjectDrawerComposition
      subject={subject}
      groups={groups}
      activeTab="files"
      selectedIds={selectedIds}
      downloadedIds={[]}
      downloadingIds={[]}
      background={{ type: "stars", starsCount: 300 }}
    >
      {/* Branded Cursor in authoritative idle state */}
      <BrandedCursor 
        x={cursorX} 
        y={cursorY} 
        isDragging={false}
        isClicking={false}
      />
    </SubjectDrawerComposition>
  );
};
