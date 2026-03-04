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

  // Success spring for celebratory effects
  const successSpring = spring({
    frame: frame - (section.successFrame ?? 0),
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 100 },
  });

  // Height spring for term list expansion/collapse
  const expandSpring = spring({
    frame: frame - expandFrame,
    fps,
    config: { damping: 18, mass: 0.6, stiffness: 120 },
  });

  // Animate height back to 0 when successFrame is reached
  const collapseProgress = section.successFrame
    ? spring({
        frame: frame - section.successFrame,
        fps,
        config: { damping: 20, mass: 0.8 },
      })
    : 0;

  // Calculate list height based on expansion and collapse state
  const currentListHeight = interpolate(expandSpring, [0, 1], [0, section.terms.length * 68 + 24]);
  const listHeight = interpolate(collapseProgress, [0, 1], [currentListHeight, 0]);

  // Registered info opacity
  const registeredInfoOpacity = section.successFrame
    ? interpolate(frame, [section.successFrame, section.successFrame + 15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Header content fade out (Summary when collapsed)
  const summaryOpacity = section.successFrame
    ? interpolate(frame, [section.successFrame, section.successFrame + 10], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Card scale and glow during celebration
  const cardScale = section.successFrame && frame >= section.successFrame
    ? interpolate(successSpring, [0, 0.5, 1], [1, 1.04, 1])
    : 1;

  const cardGlow = section.successFrame && frame >= section.successFrame
    ? interpolate(successSpring, [0, 0.5, 1], [0, 15, 0])
    : 0;

  // Determine per-term state
  const getTermState = (i: number): "idle" | "highlighted" | "processing" | "done" => {
    if (i !== (section.activeTermIndex ?? 0)) return "idle";
    if (section.successFrame && frame >= section.successFrame) return "done";
    if (section.processingFrame && frame >= section.processingFrame) return "processing";
    if (section.highlightFrame && frame >= section.highlightFrame) return "highlighted";
    return "idle";
  };

  return (
    <div
      className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow"
      style={{
        borderRadius: "8px",
        transform: `scale(${cardScale})`,
        boxShadow: cardGlow > 0 ? `0 0 ${cardGlow}px rgba(121, 190, 21, 0.3)` : undefined,
      }}
    >
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

            {/* Sub-header area with height transition between Summary and Registered info */}
            <div 
              style={{ 
                position: "relative",
                height: isRegistered ? "16px" : !isExpanded && section.terms.length > 0 ? "24px" : "0px",
                overflow: "hidden",
                transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              {/* Registered info — date + time with icons */}
              <div
                className="text-xs text-base-content/60 flex items-center gap-2 flex-wrap absolute inset-0"
                style={{ 
                  opacity: registeredInfoOpacity,
                  pointerEvents: isRegistered ? "auto" : "none",
                  transform: `translateY(${interpolate(registeredInfoOpacity, [0, 1], [10, 0])}px)`
                }}
              >
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-base-content/40" />
                  <span className="text-base-content/80 font-medium">{registeredTerm?.date}</span>
                  <span className="text-base-content/40">({registeredTerm?.day})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-base-content/40" />
                  <span className="text-base-content/80 font-medium">{registeredTerm?.time}</span>
                </span>
              </div>

              {/* Summary when collapsed */}
              {!isExpanded && !isRegistered && section.terms.length > 0 && (
                <div
                  className="flex flex-col gap-2 absolute inset-0 pt-0.5"
                  style={{ 
                    opacity: summaryOpacity,
                    transform: `translateY(${interpolate(summaryOpacity, [0, 1], [-10, 0])}px)`
                  }}
                >
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
          </div>

          {/* Action buttons / Status */}
          <div className="flex items-center gap-2 shrink-0 relative w-20 justify-end">
            <div 
              className="absolute"
              style={{ 
                opacity: registeredInfoOpacity,
                transform: `scale(${interpolate(registeredInfoOpacity, [0, 1], [0.5, 1])})`
              }}
            >
              <span
                className="badge badge-success badge-outline badge-sm font-semibold"
                style={{ borderRadius: "8px" }}
              >
                Přihlášen
              </span>
            </div>
            
            <div 
              style={{ 
                opacity: isRegistered ? 0 : 1,
                transform: `scale(${isRegistered ? 0.8 : 1})`,
                transition: "opacity 0.3s ease, transform 0.3s ease"
              }}
            >
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
            </div>
          </div>
        </div>

        {/* Term list with animated height */}
        <div style={{ height: `${listHeight}px`, overflow: "hidden" }}>
          <div className="mt-1 pt-1 px-2">
            <div className="flex flex-col gap-2">
              {section.terms.map((t, i) => (
                <TermTileMockup
                  key={i}
                  term={t}
                  state={getTermState(i)}
                  highlightFrame={i === section.activeTermIndex ? section.highlightFrame : undefined}
                  processingFrame={i === section.activeTermIndex ? section.processingFrame : undefined}
                  successFrame={i === section.activeTermIndex ? section.successFrame : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
