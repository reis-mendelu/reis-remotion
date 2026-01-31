import { BookOpen } from "lucide-react";
import { useCurrentFrame, interpolate } from "remotion";
import type { SubjectDrawerProps } from "../../../compositions/SubjectDrawer/schema";

interface SubjectDrawerSyllabusProps {
  syllabus?: SubjectDrawerProps["syllabus"];
}

export const SubjectDrawerSyllabus: React.FC<SubjectDrawerSyllabusProps> = ({
  syllabus,
}) => {
  const frame = useCurrentFrame();
  
  if (!syllabus || (!syllabus.requirementsText && !syllabus.requirementsTable?.length)) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center opacity-30 font-inter">
        <BookOpen className="w-16 h-16 mb-4" />
        <p className="text-sm font-black uppercase tracking-[0.2em]">PRO TENTO PŘEDMĚT NEJSOU<br/>DOSTUPNÉ POŽADAVKY.</p>
      </div>
    );
  }

  const entranceOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const entranceY = interpolate(frame, [0, 15], [20, 0], { extrapolateRight: 'clamp' });

  return (
    <div 
        className="h-full overflow-y-auto bg-[#1f2937] p-6 space-y-8 font-inter"
        style={{ opacity: entranceOpacity, transform: `translateY(${entranceY}px)` }}
    >
      {/* Requirements Text */}
      {syllabus.requirementsText && (
        <section className="space-y-3">
          <div className="text-[14px] text-[#f3f4f6]/80 leading-relaxed">
            {syllabus.requirementsText}
          </div>
        </section>
      )}

      {/* Grading Table */}
      {syllabus.requirementsTable && syllabus.requirementsTable.length > 0 && (
        <section className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-white/5 bg-white/[0.02]">
            <table className="w-full text-left font-bold text-[13px]">
              <thead className="bg-[#0f172a] text-[11px] text-[#f3f4f6]/40 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Popis</th>
                  <th className="px-4 py-3 text-right">Body / %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {syllabus.requirementsTable.map((row: any) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3 text-[#79be15]">{row.id}</td>
                    <td className="px-4 py-3 text-[#f3f4f6]/80">{row.label}</td>
                    <td className="px-4 py-3 text-right text-[#f3f4f6]">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
