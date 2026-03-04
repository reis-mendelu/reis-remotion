import React from "react";
import { ChevronDown, ChevronUp, Calendar, Clock } from "lucide-react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TermTileMockup, type MockTermData } from "./TermTileMockup";

export interface MockSectionData {
  subjectName: string;
  subjectCode: string;
  sectionName: string;
  terms: MockTermData[];
  /** Which term index is being clicked/registered (0-based) */
  activeTermIndex?: number;
  /** Registration animation frame range */
  highlightFrame?: number;   // frame when highlight starts
  processingFrame?: number;  // frame when spinner starts
  successFrame?: number;     // frame when registered state begins
}

interface ExamSectionCardMockupProps {
  section: MockSectionData;
  /** "collapsed" | "expanding" | "expanded" | "registered" */
  phase: "collapsed" | "expanding" | "expanded" | "registered";
  expandFrame?: number;
  /** Minimal registered term info — just date + time for Reel display */
  registeredTerm?: { date: string; day: string; time: string };
}

export const ExamSectionCardMockup: React.FC<ExamSectionCardMockupProps> = ({
  section,
  phase,
  expandFrame = 0,
  registeredTerm,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isRegistered = phase === "registered";
  const isExpanded = phase === "expanded" || phase === "expanding" || phase === "registered";

  // Height spring for term list expansion
  const expandSpring = spring({
    frame: frame - expandFrame,
    fps,
    config: { damping: 18, mass: 0.6, stiffness: 120 },
  });
  const listHeight = phase === "collapsed" ? 0 : interpolate(expandSpring, [0, 1], [0, section.terms.length * 68 + 48]);

  // Determine per-term state
  const getTermState = (i: number): "idle" | "highlighted" | "processing" | "done" => {
    if (i !== (section.activeTermIndex ?? 0)) return "idle";
    if (section.successFrame && frame >= section.successFrame) return "done";
    if (section.processingFrame && frame >= section.processingFrame) return "processing";
    if (section.highlightFrame && frame >= section.highlightFrame) return "highlighted";
    return "idle";
  };

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow" style={{ borderRadius: "8px" }}>
      <div className="p-2">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex-1 min-w-[200px]">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className="badge badge-sm font-bold bg-primary/10 text-primary py-1 h-auto whitespace-normal border-none"
                style={{ borderRadius: "8px", paddingLeft: "12px", paddingRight: "12px" }}
              >
                {section.subjectName}
              </span>
              <span className="text-sm font-bold opacity-80">{section.sectionName}</span>
            </div>

            {/* Registered info — date + time with icons */}
            {isRegistered && registeredTerm && (
              <div className="text-xs text-base-content/60 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-base-content/40" />
                  <span className="text-base-content/80 font-medium">{registeredTerm.date}</span>
                  <span className="text-base-content/40">({registeredTerm.day})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-base-content/40" />
                  <span className="text-base-content/80 font-medium">{registeredTerm.time}</span>
                </span>
              </div>
            )}

            {/* Summary when collapsed */}
            {!isExpanded && !isRegistered && section.terms.length > 0 && (
              <div className="flex flex-col gap-2 mt-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-bold text-base-content/40 tracking-wider whitespace-nowrap">
                    {section.terms.filter(t => !t.full).length} volných termínů
                  </span>
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    {section.terms.slice(0, 3).map((t, i) => (
                      <div
                        key={i}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          t.full ? "bg-base-200 text-base-content/30" : "bg-primary/5 text-primary/70"
                        }`}
                      >
                        {t.date}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons / Status */}
          <div className="flex items-center gap-2 shrink-0">
            {isRegistered ? (
              <span
                className="badge badge-success badge-outline badge-sm font-semibold"
                style={{ borderRadius: "8px" }}
              >
                Přihlášen
              </span>
            ) : (
              <span
                className={`btn gap-1 ${isExpanded ? "btn-sm btn-ghost" : "btn-sm btn-outline border-base-300"}`}
                style={{ pointerEvents: "none", borderRadius: "8px" }}
              >
                {isExpanded ? (
                  <>Zavřít <ChevronUp size={14} /></>
                ) : (
                  <>Vybrat <ChevronDown size={14} /></>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Term list with animated height */}
        {!isRegistered && (
          <div style={{ height: `${listHeight}px`, overflow: "hidden" }}>
            {listHeight > 20 && (
              <div className="mt-1 pt-1">

                <div className="flex flex-col gap-2">
                  {section.terms.map((t, i) => (
                    <TermTileMockup key={i} term={t} state={getTermState(i)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
