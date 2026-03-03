import React from "react";
import { AlertTriangle } from "lucide-react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import type { SubjectDrawerProps } from "../../../compositions/SubjectDrawer/schema";

interface SubjectDrawerSuccessRateProps {
  successRate?: SubjectDrawerProps["successRate"];
}

const GRADE_COLORS: Record<string, string> = {
  A: "#10b981",
  B: "#34d399",
  C: "#a3e635",
  D: "#fbbf24",
  E: "#fb923c",
  F: "rgba(255, 255, 255, 0.05)",
  FN: "#ef4444",
  zap: "#10b981",
  nezap: "#ef4444",
};

export const SubjectDrawerSuccessRate: React.FC<SubjectDrawerSuccessRateProps> = ({
  successRate,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!successRate?.stats?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center opacity-30 font-inter">
        <AlertTriangle className="w-16 h-16 mb-4" />
        <p className="text-sm font-black uppercase tracking-[0.2em]">DATA O ÚSPĚŠNOSTI<br />NEJSOU K DISPOZICI.</p>
      </div>
    );
  }

  const current = successRate.stats[0];
  const isCredit = current.type === "credit";
  const total = current.totalPass + current.totalFail;

  // Match real extension: FN stays as "FN", displayed as "-" in label only
  const order = isCredit ? ["zap", "nezap"] : ["A", "B", "C", "D", "E", "F", "FN"];

  // Aggregate grades from terms
  const aggregatedGrades: Record<string, number> = {};
  current.terms.forEach((term) => {
    if (isCredit && term.creditGrades) {
      aggregatedGrades.zap = (aggregatedGrades.zap || 0) + term.creditGrades.zap;
      aggregatedGrades.nezap = (aggregatedGrades.nezap || 0) + term.creditGrades.nezap + (term.creditGrades.zapNedost || 0);
    } else if (term.grades) {
      Object.entries(term.grades).forEach(([g, c]) => {
        aggregatedGrades[g] = (aggregatedGrades[g] || 0) + (c as number);
      });
    }
  });

  const maxCount = Math.max(...order.map(g => aggregatedGrades[g] || 0), 1);
  const MAX_BAR = 110;
  const entranceOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      className="flex flex-col h-full px-4 py-3 select-none font-inter text-white"
      style={{ opacity: entranceOpacity }}
    >
      {/* Header — matches real: text-sm, shows type */}
      <div className="text-center mb-6 flex items-center justify-center gap-2">
        <span className="text-sm opacity-50 font-bold uppercase tracking-wider">
          {total} studentů{isCredit ? " (zápočet)" : " (zkouška)"}
        </span>
      </div>

      {/* Histogram — matches real: 160px container, 110px max bar, gap-3, rounded-t-md, equal columns */}
      <div className="flex justify-center items-end gap-3 px-1 mb-4 relative" style={{ height: "150px" }}>
        {order.map((grade, i) => {
          const count = aggregatedGrades[grade] || 0;
          const barHeight = (count / maxCount) * MAX_BAR;

          const growSpring = spring({
            frame: frame - (40 + i * 4),
            fps,
            config: { damping: 20, mass: 0.5, stiffness: 150 },
          });

          return (
            <div
              key={grade}
              className="flex flex-col items-center gap-1"
              style={{ flex: `0 0 calc((100% - 6 * 0.75rem) / 7)`, transform: "translateZ(0)" }}
            >
              <span
                className="text-[11px] font-bold tabular-nums"
                style={{
                  opacity: count > 0 ? Math.round(interpolate(growSpring, [0.8, 1], [0, 0.4]) * 100) / 100 : 0,
                  transform: "translateZ(0)",
                }}
              >
                {count}
              </span>
              <div
                className="w-full rounded-t-md shadow-sm"
                style={{
                  height: `${Math.round(Math.max(4, barHeight * growSpring))}px`,
                  backgroundColor: GRADE_COLORS[grade] || "#fff",
                  opacity: count > 0 ? 1 : 0.05,
                  transform: "translateZ(0)",
                }}
              />
              <span
                className="text-[9px] font-black text-white/30 mt-1 uppercase"
                style={{ transform: "translateZ(0)" }}
              >
                {grade === "FN" ? "-" : grade}
              </span>
            </div>
          );
        })}
      </div>

      {/* Semester Selector — matches real: w-12 h-12 donut, r=13, strokeWidth=3, px-3 py-2, flex-wrap */}
      <div className="flex flex-wrap justify-center gap-2 mt-auto mb-2">
        {(successRate.stats || []).slice(0, 5).map((stat, i) => {
          const statTotal = stat.totalPass + stat.totalFail;
          const successPct = statTotal === 0
            ? 0
            : Math.round((stat.totalPass / statTotal) * 100);
          const dashArray = 2 * Math.PI * 13; // ~81.68
          const dashOffset = dashArray * (1 - successPct / 100);
          const isActive = i === 0;

          const circleEntrance = spring({
            frame: frame - (40 + i * 4),
            fps,
            config: { damping: 15, mass: 0.6 },
          });

          const animatedDashOffset = interpolate(
            circleEntrance,
            [0, 1],
            [dashArray, dashOffset],
          );

          return (
            <div
              key={stat.semester}
              className={`flex flex-col items-center gap-2 px-3 py-2 rounded-xl ${
                isActive ? "bg-[#10b981]/10 ring-1 ring-[#10b981]/30" : "text-white/40"
              }`}
              style={{
                transform: `scale(${circleEntrance}) translateZ(0)`,
                backfaceVisibility: "hidden",
              }}
            >
              <div className="relative w-12 h-12 flex items-center justify-center" style={{ transform: "translateZ(0)" }}>
                <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32" style={{ shapeRendering: "geometricPrecision" }}>
                  <circle cx="16" cy="16" r="13" className="fill-none stroke-white/10" strokeWidth="3" />
                  <circle
                    cx="16" cy="16" r="13"
                    className={`fill-none ${isActive ? "stroke-[#10b981]" : "stroke-[#10b981]/40"}`}
                    strokeWidth="3"
                    strokeDasharray={dashArray}
                    strokeDashoffset={animatedDashOffset}
                    strokeLinecap="round"
                  />
                </svg>
                <span className={`absolute font-black tabular-nums ${successPct === 100 ? "text-[9px]" : "text-[10px]"}`}>
                  {successPct}%
                </span>
              </div>
              <span className={`text-[11px] font-black ${isActive ? "text-[#10b981]" : ""}`}>
                {stat.semester}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
