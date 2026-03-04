import React from "react";
import { BookOpen } from "lucide-react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ExamSectionCardMockup, type MockSectionData } from "./ExamSectionCardMockup";
import { MendeluEnvironment } from "../../Environment";

interface ExamPanelMockupProps {
  scale?: number;
  /** Frame when the main card (Matematika) starts expanding */
  expandFrame?: number;
  /** Frame when the term tile is highlighted (click) */
  highlightFrame?: number;
  /** Frame when spinner appears */
  processingFrame?: number;
  /** Frame when registered state begins */
  successFrame?: number;
}

const MATEMATIKA_TERMS = [
  { date: "05.01", day: "Po", time: "09:00", room: "PEF studovna", capacity: { occupied: 18, total: 20 } },
  { date: "12.01", day: "Čt", time: "11:00", room: "PEF studovna", capacity: { occupied: 20, total: 20 }, full: true },
  { date: "19.01", day: "Po", time: "09:00", room: "PEF studovna", capacity: { occupied: 5, total: 20 } },
];

export const ExamPanelMockup: React.FC<ExamPanelMockupProps> = ({
  scale = 1,
  expandFrame = 50,
  highlightFrame = 130,
  processingFrame = 145,
  successFrame = 165,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Panel entrance spring
  const panelSpring = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const panelY = interpolate(panelSpring, [0, 1], [60, 0]);
  const panelOpacity = interpolate(panelSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  // Cards stagger in
  const card1Spring = spring({ frame: frame - 15, fps, config: { damping: 16, mass: 0.5 } });
  const card1Y = interpolate(card1Spring, [0, 1], [20, 0]);
  const card1Opacity = interpolate(card1Spring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  const card2Spring = spring({ frame: frame - 25, fps, config: { damping: 16, mass: 0.5 } });
  const card2Y = interpolate(card2Spring, [0, 1], [20, 0]);
  const card2Opacity = interpolate(card2Spring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  // Phase of the animated card
  const isRegistered = frame >= successFrame;
  const isExpanded = frame >= expandFrame;

  const matematikaSectionData: MockSectionData = {
    subjectName: "Matematika",
    subjectCode: "EBC-MAT",
    sectionName: "Zkouška",
    terms: MATEMATIKA_TERMS,
    activeTermIndex: 0,
    highlightFrame,
    processingFrame,
    successFrame,
  };

  const registeredTerm = {
    date: "05.01",
    day: "Po",
    time: "09:00",
    room: "PEF studovna",
    deregistrationDeadline: "02.01.2026 23:59",
  };

  return (
    <MendeluEnvironment
      style={{
        transform: `scale(${scale}) translateY(${panelY}px)`,
        opacity: panelOpacity,
        transformOrigin: "top center",
        width: "520px",
      }}
    >
      <div className="flex flex-col bg-base-100 rounded-xl border border-base-300 shadow-lg overflow-hidden">
        {/* Panel header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-base-200">
          <BookOpen size={16} className="text-primary" />
          <span className="font-black text-sm uppercase tracking-wider">Zkoušky</span>
          <div className="ml-auto flex gap-1.5">
            <span className="badge badge-sm badge-success badge-outline font-semibold">Přihlášen · 1</span>
            <span className="badge badge-sm bg-base-200 border-none font-semibold opacity-70">Volné · 2</span>
          </div>
        </div>

        {/* Card list */}
        <div className="flex flex-col gap-3 p-3">
          {/* Matematika — animated */}
          <div style={{ transform: `translateY(${card1Y}px)`, opacity: card1Opacity }}>
            <ExamSectionCardMockup
              section={matematikaSectionData}
              phase={isRegistered ? "registered" : isExpanded ? "expanded" : "collapsed"}
              expandFrame={expandFrame}
              registeredTerm={registeredTerm}
            />
          </div>

          {/* Statistika — registered, static */}
          <div style={{ transform: `translateY(${card2Y}px)`, opacity: card2Opacity }}>
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="p-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge badge-sm font-bold bg-primary/10 text-primary py-1 h-auto border-none">
                    Statistika
                  </span>
                  <span className="text-sm font-bold opacity-80">Zkouška</span>
                  <span className="badge badge-success badge-outline badge-sm font-semibold">Přihlášen</span>
                </div>
                <div className="text-xs text-base-content/60 flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <span className="text-base-content/80 font-medium">18.12.2025</span>
                    <span className="text-base-content/40">(Čt)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-base-content/80 font-medium">09:00</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-base-content/80 font-medium">Q02</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MendeluEnvironment>
  );
};
