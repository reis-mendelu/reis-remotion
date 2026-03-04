import React from "react";
import { Clock, MapPin, Users, CircleCheck } from "lucide-react";

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
}

export const TermTileMockup: React.FC<TermTileMockupProps> = ({ term, state = "idle" }) => {
  const isFull = term.full || term.capacity.occupied >= term.capacity.total;
  const isHighlighted = state === "highlighted";
  const isProcessing = state === "processing";
  const isDone = state === "done";
  const disabled = isFull || isDone;

  const capacityPct = Math.min(100, (term.capacity.occupied / term.capacity.total) * 100);

  return (
    <div
      className={`flex items-center gap-3 w-full p-3 rounded-lg border text-left transition-none ${
        isFull
          ? "bg-base-200 opacity-60 border-base-300"
          : isHighlighted || isProcessing
          ? "bg-primary/10 border-primary/60 shadow-sm"
          : "bg-base-100 border-base-200 shadow-sm"
      }`}
    >
      {/* Date + Day */}
      <div className="flex flex-col min-w-[48px]">
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
      <div className="flex items-center gap-1 min-w-[52px]">
        <Clock size={12} className="text-base-content/40" />
        <span className="text-sm opacity-70">{term.time}</span>
      </div>

      {/* Room */}
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <MapPin size={12} className="text-base-content/40 shrink-0" />
        <span className="text-sm truncate opacity-70">{term.room}</span>
      </div>

      {/* Capacity */}
      <div className="flex items-center gap-2 min-w-[90px]">
        <Users size={12} className="text-base-content/40" />
        <div className="flex items-center gap-1.5">
          <progress
            className={`progress w-12 h-1.5 ${isFull ? "progress-error" : "progress-primary"}`}
            value={capacityPct}
            max="100"
          />
          <span className={`text-xs ${isFull ? "text-error font-medium" : "opacity-50"}`}>
            {isFull ? "Plná" : `${term.capacity.occupied}/${term.capacity.total}`}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="shrink-0 ml-auto">
        {isProcessing ? (
          <span className="loading loading-spinner loading-sm text-primary" />
        ) : isFull ? (
          <span className="text-error/60 text-sm font-medium">✕</span>
        ) : isDone ? null : (
          <span
            className={`btn btn-primary btn-sm ${isHighlighted ? "btn-active" : ""}`}
            style={{ pointerEvents: "none" }}
          >
            Přihlásit
          </span>
        )}
      </div>
    </div>
  );
};
