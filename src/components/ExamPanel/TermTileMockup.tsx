import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Clock, MapPin, CircleCheck } from "lucide-react";

export interface MockTermData {
  date: string;      // "05.01"
  day: string;       // "Po"
  time: string;      // "09:00"
  room: string;      // "PEF studovna"
  capacity: { occupied: number; total: number };
  full?: boolean;
}

interface TermTileMockupProps {
  term: MockTermData;
  /** "idle" | "highlighted" | "processing" | "done" */
  state?: "idle" | "highlighted" | "processing" | "done";
  highlightFrame?: number;
  processingFrame?: number;
  successFrame?: number;
}

export const TermTileMockup: React.FC<TermTileMockupProps> = ({
  term,
  state = "idle",
  highlightFrame,
  processingFrame,
  successFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isFull = term.full || (term.capacity && term.capacity.occupied >= term.capacity.total);
  const isHighlighted = state === "highlighted";
  const isProcessing = state === "processing";
  const isDone = state === "done";
  const disabled = isFull || isDone;

  // Smoothing for Highlighted/Processing state
  const highlightProgress = highlightFrame
    ? spring({
        frame: frame - highlightFrame,
        fps,
        config: { damping: 15, mass: 0.4 },
      })
    : 0;

  const bgOpacity = interpolate(highlightProgress, [0, 1], [0, 0.1]);
  const borderColorOpacity = interpolate(highlightProgress, [0, 1], [0, 0.6]);
  const scale = interpolate(highlightProgress, [0, 1], [1, 1.02]);

  // Done state (registration success) fade out/shift
  const doneProgress = successFrame
    ? spring({
        frame: frame - successFrame,
        fps,
        config: { damping: 20 },
      })
    : 0;

  const tileOpacity = interpolate(doneProgress, [0, 1], [1, 0.4]);

  return (
    <div
      className={`flex items-center gap-3 w-full p-3 border text-left transition-none ${
        isFull ? "bg-base-200 opacity-60 border-base-300" : "bg-base-100 border-base-200 shadow-sm"
      }`}
      style={{
        borderRadius: "8px",
        backgroundColor: !isFull && highlightFrame ? `rgba(121, 190, 21, ${bgOpacity})` : undefined,
        borderColor: !isFull && highlightFrame ? `rgba(121, 190, 21, ${borderColorOpacity})` : undefined,
        transform: `scale(${scale})`,
        opacity: isDone ? tileOpacity : undefined,
      }}
    >
      {/* Date + Day */}
      <div className="flex flex-col min-w-[80px]">
        <span className={`font-semibold text-sm ${disabled ? "text-base-content/50 line-through" : ""}`}>
          {term.date}
        </span>
        <span className="text-xs text-base-content/60">{term.day}</span>
      </div>

      {/* Attempt type icon */}
      <div className="flex items-center">
        <CircleCheck size={14} className="text-success" />
      </div>

      {/* Time */}
      <div className="flex items-center gap-1 min-w-[60px]">
        <Clock size={12} className="text-base-content/40" />
        <span className="text-sm opacity-70">{term.time}</span>
      </div>

      {/* Room */}
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <MapPin size={12} className="text-base-content/40 shrink-0" />
        <span className="text-sm truncate opacity-70">{term.room}</span>
      </div>



      {/* CTA */}
      <div className="shrink-0 ml-auto relative flex items-center justify-end w-24">
        {/* Spinner */}
        <div 
          className="absolute inset-0 flex items-center justify-end"
          style={{ 
            opacity: isProcessing || isDone ? 1 : 0,
            transform: `scale(${isProcessing || isDone ? 1 : 0.8})`,
            transition: "opacity 0.2s ease, transform 0.2s ease"
          }}
        >
          {isProcessing && <span className="loading loading-spinner loading-sm text-primary" />}
        </div>

        {/* Button */}
        {!isFull && !isDone && (
          <span
            className={`btn btn-primary btn-sm h-auto py-1.5 whitespace-nowrap ${isHighlighted ? "btn-active" : ""}`}
            style={{ 
              pointerEvents: "none", 
              borderRadius: "8px", 
              paddingLeft: "24px", 
              paddingRight: "24px",
              opacity: isProcessing ? 0 : 1,
              transform: `scale(${isProcessing ? 0.9 : 1})`,
              transition: "opacity 0.2s ease, transform 0.2s ease"
            }}
          >
            Přihlásit
          </span>
        )}

        {isFull && (
          <span className="text-error/60 text-sm font-medium">✕</span>
        )}
      </div>
    </div>
  );
};
