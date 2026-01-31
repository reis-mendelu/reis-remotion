import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ProfessionalText } from "../../components/ProfessionalText";
import { SubjectDrawerComposition } from "./index";
import { Background } from "../../components/Background";

export const SubjectDrawerShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Cinematic sequence timing
  const INTRO_DURATION = 60;
  const COMPONENT_START = INTRO_DURATION;
  
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.1]);

  return (
    <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
      <Background type="stars" starsCount={400} />
      
      {/* Scene 1: High Authority Intro */}
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <AbsoluteFill className="items-center justify-center">
          <ProfessionalText 
            text="SPRÁVA STUDIA: *PŘEHLEDNĚ*" 
            type="headline" 
            mode="minimalist" 
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Standard ReIS Component */}
      <Sequence from={COMPONENT_START}>
        <AbsoluteFill>
          {/* Surround the component with a high-authority label at the top */}
          <AbsoluteFill className="items-center justify-start pt-20" style={{ zIndex: 10 }}>
             <ProfessionalText 
                text="STANDARDNÍ ROZHRANÍ" 
                type="context" 
                mode="minimalist"
             />
          </AbsoluteFill>

          <SubjectDrawerComposition
            subject={{
              name: "Algoritmizace",
              code: "INP",
              credits: "6 Kreditů",
              status: "Povinný",
              completion: "Zkouška",
              garant: "doc. Ing. Oldřich Trenz, Ph.D.",
              vyucujici: [
                { name: "doc. Dr. Ing. Jiří Rybička", roles: "cvičící, přednášející, tutor, zkoušející" },
                { name: "doc. Ing. Oldřich Trenz, Ph.D.", roles: "cvičící, přednášející, tutor, zkoušející" },
                { name: "Ing. Pavel Turčínek, Ph.D.", roles: "cvičící, přednášející, tutor, zkoušející" }
              ]
            }}
            groups={[
              {
                name: "ostatni",
                displayName: "OSTATNÍ",
                files: [
                  { file_name: "Cvičení 3 Programování sekvence a větvení", link: "f1" },
                  { file_name: "Cvičení 4 -- cykly elementární algoritmy", link: "f2" },
                  { file_name: "Harmonogram výuky a podmínky ukončení", link: "f3" },
                  { file_name: "Pracovní listy 1 a 2 -- Vývojové diagramy (1)", link: "f4", file_comment: "Inspirace pro první cvičení" },
                  { file_name: "Pracovní listy 1 a 2 -- Vývojové diagramy (2)", link: "f5", file_comment: "Inspirace pro první cvičení" },
                  { file_name: "Pracovní list 5 -- Podprogramy", link: "f6" },
                  { file_name: "Pracovní list 6 -- Pole a záznamy", link: "f7" },
                  { file_name: "Pracovní list 7 -- Matice", link: "f8" }
                ]
              }
            ]}
            activeTab="files"
            animate={true}
            scale={1.0}
            progress={1}
            selectedIds={[]}
            downloadedIds={[]}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
