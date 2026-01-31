import React from "react";
import { Download, Loader2, X, ExternalLink, Check, User } from "lucide-react";
import { interpolate, useCurrentFrame } from "remotion";
import type { Subject } from "../../compositions/SubjectDrawer/schema";

interface SubjectDrawerHeaderProps {
  subject: Subject;
  activeTab: "files" | "syllabus" | "stats";
  onTabChange?: (tab: "files" | "syllabus" | "stats") => void;
  isDownloading?: boolean;
  downloadProgress?: { completed: number; total: number; isFinished: boolean } | null;
  totalFiles?: number;
}

export const SubjectDrawerHeader: React.FC<SubjectDrawerHeaderProps> = ({
  subject,
  activeTab,
  onTabChange,
  isDownloading,
  downloadProgress,
  totalFiles = 0,
}) => {
  const frame = useCurrentFrame();
  const isFinished = downloadProgress?.isFinished;

  const downloadLabel = downloadProgress
    ? `Stáhnout (${downloadProgress.completed}/${downloadProgress.total})`
    : isDownloading
    ? `Stáhnout (${totalFiles})`
    : `Stáhnout (${totalFiles})`;

  const tabs = [
    { id: "files", label: "SOUBORY" },
    { id: "syllabus", label: "POŽADAVKY" },
    { id: "stats", label: "ÚSPĚŠNOST" },
  ] as const;

  return (
    <div className="px-6 py-5 border-b border-white/5 bg-[#1f2937] z-20 font-inter">
      <div className="flex items-center justify-between mb-4">
        {/* Chips */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-[#0f172a] text-[#f3f4f6]/70 text-[11px] font-bold">
            {subject.status}
          </span>
          <span className="px-2 py-1 rounded bg-[#79be15]/20 text-[#79be15] text-[11px] font-bold">
            {subject.completion} ({subject.credits})
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div 
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[14px] transition-all
              ${isFinished 
                ? "bg-[#79be15] text-white" 
                : "bg-[#79be15] text-white hover:bg-[#88d618]"}
            `}
          >
             {/* Progress Indicator on the left */}
            {isDownloading && (
               <div className="flex items-center gap-1.5 mr-1 pr-2 border-r border-white/20">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-[12px] opacity-80 tabular-nums">
                    {downloadProgress ? `${downloadProgress.completed}/${downloadProgress.total}` : `0/${totalFiles}`}
                  </span>
               </div>
            )}

            {isFinished ? (
              <Check size={16} />
            ) : !isDownloading && (
              <Download size={16} />
            )}
            <span>{downloadLabel}</span>
          </div>

          <div className="text-[#f3f4f6]/40 hover:text-[#f3f4f6]/60 cursor-pointer">
            <X size={22} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <div className="text-2xl font-bold flex items-center gap-2 text-[#f3f4f6]">
          <span>{subject.name}</span>
          <ExternalLink size={16} className="opacity-30" />
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-2 w-full mt-1 text-[13px]">
        {subject.garant && (
          <div className="flex items-center gap-2 text-[#f3f4f6]/40">
            <User size={14} className="opacity-50" />
            <span className="italic font-bold">
              Garant: <span className="not-italic text-[#f3f4f6] font-bold ml-1">{subject.garant}</span>
            </span>
          </div>
        )}
        {subject.vyucujici && subject.vyucujici.length > 0 && (
          <div className="flex items-start gap-2 text-[#f3f4f6]/40">
            <span className="italic font-bold mt-0.5">Vyučující:</span>
            <div className="flex flex-col gap-1.5 flex-1">
              {subject.vyucujici.map((v, i) => (
                <div key={i} className="flex items-center gap-2 leading-tight">
                  <span className="font-bold text-[#f3f4f6]">{v.name}</span>
                  {v.roles && (
                    <span className="text-[11px] text-[#f3f4f6]/30">
                      ({v.roles.toLowerCase()})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 mt-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const labels: Record<string, string> = {
            files: "Soubory",
            syllabus: "Požadavky",
            stats: "Úspěšnost"
          };
          return (
            <div
              key={tab.id}
              onClick={() => onTabChange?.(tab.id as any)}
              className={`
                text-[15px] font-bold pb-2 border-b-[3px] transition-all px-1 cursor-pointer
                ${
                  isActive
                    ? "border-[#79be15] text-[#79be15]"
                    : "border-transparent text-[#f3f4f6]/40 hover:text-[#f3f4f6]/60"
                }
              `}
            >
              {labels[tab.id]}
            </div>
          );
        })}
      </div>
    </div>
  );
};
