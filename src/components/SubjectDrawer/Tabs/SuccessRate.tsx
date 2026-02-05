import { AlertTriangle } from "lucide-react";
import { useCurrentFrame, interpolate } from "remotion";
import type { SubjectDrawerProps } from "../../../compositions/SubjectDrawer/schema";

interface SubjectDrawerSuccessRateProps {
  successRate?: SubjectDrawerProps["successRate"];
}

const GRADE_COLORS: Record<string, string> = {
  A: "#10b981", // Emerald 500
  B: "#34d399", // Emerald 400
  C: "#fbbf24", // Amber 400
  D: "#fb923c", // Orange 400
  E: "#f87171", // Red 400
  F: "#ef4444", // Red 500
  FN: "#7f1d1d", // Red 900
  zap: "#10b981", 
  nezap: "#ef4444"
};

export const SubjectDrawerSuccessRate: React.FC<SubjectDrawerSuccessRateProps> = ({
  successRate,
}) => {
  const frame = useCurrentFrame();

  if (!successRate?.stats?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center opacity-30 font-inter">
        <AlertTriangle className="w-16 h-16 mb-4" />
        <p className="text-sm font-black uppercase tracking-[0.2em]">DATA O ÚSPĚŠNOSTI<br/>NEJSOU K DISPOZICI.</p>
      </div>
    );
  }

  // Use the first (latest) semester for the visualization
  const current = successRate.stats[0];
  const isCredit = current.type === "credit";
  const total = current.totalPass + current.totalFail;
  
  const order = isCredit ? ["zap", "nezap"] : ["A", "B", "C", "D", "E", "F", "FN"];

  // Aggregate grades from terms
  const aggregatedGrades: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  current.terms.forEach((term: any) => {
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
  
  const entranceOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div 
        className="flex flex-col h-full px-6 py-6 select-none font-inter bg-[#1f2937]"
        style={{ opacity: entranceOpacity }}
    >
      <div className="text-center mb-8 flex items-center justify-center gap-2">
        <span className="text-[12px] opacity-40 font-bold uppercase tracking-widest text-[#f3f4f6]">
            {total} studentů {isCredit ? ' (Zápočet)' : ' (Zkouška)'}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {order.map((grade, i) => {
            const count = aggregatedGrades[grade] || 0;
            const percentage = (count / total) * 100;
            const barWidth = (count / maxCount) * 100;
            
            // Staggered grow animation for bars
            const growProgress = interpolate(frame, [10 + i * 3, 25 + i * 3], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp'
            });

            return (
                <div key={grade} className="flex items-center gap-4">
                    <div className="w-8 text-right font-bold text-[12px] text-[#f3f4f6]/40">{grade}</div>
                    <div className="flex-1 h-7 bg-[#0f172a] rounded overflow-hidden relative border border-white/5">
                        <div 
                            className="h-full transition-all duration-300"
                            style={{ 
                                width: `${barWidth * growProgress}%`, 
                                backgroundColor: GRADE_COLORS[grade] || '#fff',
                            }}
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center text-[11px] font-bold text-[#f3f4f6]">
                            {count > 0 && `${Math.round(percentage)}%`}
                        </div>
                    </div>
                    <div className="w-10 text-[12px] text-[#f3f4f6]/30 font-bold">{count}</div>
                </div>
            );
        })}
      </div>
      
      <div className="mt-8 flex justify-center gap-2">
          <div className="px-4 py-1.5 bg-[#0f172a] rounded-full text-[10px] font-bold text-[#f3f4f6]/30 uppercase tracking-[0.2em] border border-white/5">
              {current.semester}
          </div>
      </div>
    </div>
  );
};
