import React from "react";
import { AlertTriangle } from "lucide-react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import type { SubjectDrawerProps } from "../../../compositions/SubjectDrawer/schema";

interface SubjectDrawerSuccessRateProps {
  successRate?: SubjectDrawerProps["successRate"];
}

const GRADE_COLORS: Record<string, string> = {
  A: "#10b981", // Emerald 500
  B: "#34d399", // Emerald 400
  C: "#a3e635", // Lime 400
  D: "#fbbf24", // Amber 400
  E: "#fb923c", // Orange 400
  F: "rgba(255, 255, 255, 0.05)",
  "-": "#ef4444", // Red 500
  zap: "#10b981",
  nezap: "#ef4444"
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

  // Use the first (latest) semester for the main visualization
  const current = successRate.stats[0];
  const isCredit = current.type === "credit";
  const total = current.totalPass + current.totalFail;

  const order = isCredit ? ["zap", "nezap"] : ["A", "B", "C", "D", "E", "F", "-"];

  // Aggregate grades from terms
  const aggregatedGrades: Record<string, number> = {};
  current.terms.forEach((term) => {
    if (isCredit && term.creditGrades) {
      aggregatedGrades.zap = (aggregatedGrades.zap || 0) + term.creditGrades.zap;
      aggregatedGrades.nezap = (aggregatedGrades.nezap || 0) + term.creditGrades.nezap + (term.creditGrades.zapNedost || 0);
    } else if (term.grades) {
      Object.entries(term.grades).forEach(([g, c]) => {
        const gradeKey = g === "FN" ? "-" : g;
        aggregatedGrades[gradeKey] = (aggregatedGrades[gradeKey] || 0) + (c as number);
      });
    }
  });

  const maxCount = Math.max(...order.map(g => aggregatedGrades[g] || 0), 1);
  const entranceOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      className="flex flex-col h-full px-4 pt-1 pb-2 select-none font-inter text-white"
      style={{ opacity: entranceOpacity }}
    >
      {/* Header Stat */}
      <div className="text-center mb-8 mt-[-4px] flex items-center justify-center gap-2">
        <span className="text-[11px] opacity-50 font-bold uppercase tracking-wider">
          {total} studentů
        </span>
      </div>

      {/* Histogram */}
      <div className="flex justify-center items-end gap-2 px-1 mb-6 relative" style={{ height: "110px" }}>
        {order.map((grade, i) => {
          const count = aggregatedGrades[grade] || 0;
          const barHeight = (count / maxCount) * 100;

          // Staggered grow animation for bars - Stiffer for 60fps
          const growSpring = spring({
            frame: frame - (40 + i * 4), // Doubled delay for 60fps
            fps,
            config: { damping: 20, mass: 0.5, stiffness: 150 } // Stiffer
          });

          return (
            <div key={grade} className="flex flex-col items-center gap-1 flex-1" style={{ transform: 'translateZ(0)' }}>
              <span
                className="text-[9px] font-bold tabular-nums"
                style={{
                  opacity: count > 0 ? Math.round(interpolate(growSpring, [0.8, 1], [0, 0.4]) * 100) / 100 : 0,
                  transform: 'translateZ(0)',
                }}
              >
                {count}
              </span>
              <div
                className="w-full rounded-t-sm shadow-sm"
                style={{
                  height: `${Math.round(Math.max(3, barHeight * growSpring))}px`,
                  backgroundColor: GRADE_COLORS[grade] || '#fff',
                  opacity: count > 0 ? 1 : 0.05,
                  transform: 'translateZ(0)',
                }}
              />
              <span
                className="text-[9px] font-black text-white/30 mt-1 uppercase"
                style={{ transform: 'translateZ(0)' }}
              >
                {grade}
              </span>
            </div>
          );
        })}
      </div>

      {/* Semester Indicators */}
      <div className="flex justify-center gap-3 mt-auto mb-10">
        {(successRate.stats || []).map((stat, i) => {
          const successPct = stat.totalPass + stat.totalFail === 0
            ? 0
            : Math.round((stat.totalPass / (stat.totalPass + stat.totalFail)) * 100);
          const dashArray = 78.54; // 2 * Math.PI * 12.5
          const dashOffset = dashArray * (1 - successPct / 100);

          const isActive = i === 0;

          const circleEntrance = spring({
            frame: frame - (40 + i * 4),
            fps,
            config: { damping: 15, mass: 0.6 }
          });

          const animatedDashOffset = interpolate(
            circleEntrance,
            [0, 1],
            [dashArray, dashOffset]
          );

          return (
            <div
              key={stat.semester}
              className={`flex flex-col items-center gap-1.5 px-0 py-1.5 rounded-xl w-[60px] ${isActive ? "bg-[#10b981]/10 ring-1 ring-[#10b981]/30" : "text-white/40"
                }`}
              style={{
                transform: `scale(${circleEntrance}) translateZ(0)`,
                opacity: i < 5 ? 1 : 0,
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="relative w-10 h-10 flex items-center justify-center" style={{ transform: 'translateZ(0)' }}>
                <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32" style={{ shapeRendering: 'geometricPrecision' }}>
                  <circle cx="16" cy="16" r="12.5" className="fill-none stroke-white/10" strokeWidth="2" />
                  <circle
                    cx="16" cy="16" r="12.5"
                    className={`fill-none ${isActive ? 'stroke-[#10b981]' : 'stroke-[#10b981]/40'}`}
                    strokeWidth="2"
                    strokeDasharray={dashArray}
                    strokeDashoffset={animatedDashOffset}
                    strokeLinecap="round"
                  />
                </svg>
                <span className={`absolute font-black tabular-nums ${successPct === 100 ? 'text-[7.5px]' : 'text-[8.5px]'}`}>
                  {successPct}%
                </span>
              </div>
              <span className={`text-[9px] font-black ${isActive ? 'text-[#10b981]' : ''}`}>
                {stat.semester}
              </span>
            </div>
          );
        }).slice(0, 5)}
      </div>
    </div>
  );
};

