import React from "react";
import { Download, Check } from "lucide-react";
import { useCurrentFrame, interpolate } from "remotion";
import type { Subject } from "../../compositions/SubjectDrawer/schema";

interface SubjectDrawerHeaderProps {
  subject: Subject;
  selectedCount?: number;
  activeTab?: "files" | "syllabus" | "stats";
}

interface SubjectDrawerHeaderProps {
  subject: Subject;
  selectedCount?: number;
  activeTab?: "files" | "syllabus" | "stats";
  isDone?: boolean;
}

export const SubjectDrawerHeader: React.FC<SubjectDrawerHeaderProps> = ({
  subject,
  selectedCount = 0,
  activeTab = "files",
  isDone = false,
}) => {
  const frame = useCurrentFrame();
  const hasSelection = selectedCount > 0;

  // More controlled pulse on state change
  const activePulse = hasSelection || isDone 
    ? interpolate(Math.sin((frame / 10) * Math.PI), [-1, 1], [1, 1.03])
    : 1;

  return (
    <div className="px-8 py-6 bg-[#1a1f26] z-20 font-inter flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {/* Chips */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-black/40 text-white/40 text-[9px] font-bold leading-none">
            {subject.status}
          </span>
          <span className="px-2 py-0.5 rounded bg-[#79be15]/10 text-[#79be15] text-[9px] font-bold leading-none">
            {subject.completion} ({subject.credits})
          </span>
        </div>

        {/* Title Area */}
        <div className="flex items-center justify-between pb-1"> {/* Added padding-bottom for descenders */}
          <h1 className="text-white font-bold text-xl leading-tight flex-1 overflow-hidden" style={{ lineHeight: '1.3' }}>
            {subject.name}
          </h1>
          
          <div 
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-[10px] transition-all duration-300 shadow-lg
              ${isDone 
                ? "bg-[#79be15] text-white shadow-[0_0_25px_rgba(121,190,21,0.5)]"
                : hasSelection 
                ? "bg-[#79be15] text-white shadow-[0_0_15px_rgba(121,190,21,0.3)]" 
                : "bg-[#374151] text-white/20 shadow-none border border-white/5"
              }
            `}
            style={{ transform: `scale(${activePulse})` }}
          >
             {isDone ? (
               <Check size={14} strokeWidth={4} className="text-white" />
             ) : (
               <Download size={14} strokeWidth={3} className={hasSelection ? "text-white" : "text-white/20"} />
             )}
             <span>
               {isDone ? "Staženo" : `Stáhnout ${hasSelection ? `(${selectedCount})` : ""}`}
             </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-white/5">
        {[
            { id: "files", label: "Soubory" },
            { id: "syllabus", label: "Požadavky" },
            { id: "stats", label: "Úspěšnost" }
        ].map(tab => (
            <div 
                key={tab.id}
                className={`
                    pb-3 text-[10px] font-bold border-b-2 transition-colors cursor-pointer
                    ${activeTab === tab.id 
                        ? "text-white border-[#79be15]" 
                        : "text-white/20 border-transparent hover:text-white/40"
                    }
                `}
            >
                {tab.label}
            </div>
        ))}
      </div>
    </div>
  );
};
