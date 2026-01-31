import React from "react";
import { Folder, FileText, Check } from "lucide-react";
import { interpolate, useCurrentFrame } from "remotion";
import type { FileGroup } from "../../../compositions/SubjectDrawer/schema";

interface SubjectDrawerFileListProps {
  groups: FileGroup[];
  selectedIds: string[];
  downloadedIds: string[];
}

export const SubjectDrawerFileList: React.FC<SubjectDrawerFileListProps> = ({
  groups,
  selectedIds,
  downloadedIds,
}) => {
  const frame = useCurrentFrame();

  return (
    <div className="p-6 space-y-6 bg-[#1f2937] min-h-full font-inter">
      {groups.map((group, groupIndex) => (
        <div key={group.name} className="space-y-4">
          <div className="flex items-center gap-2 text-[12px] font-bold text-[#f3f4f6]/30 uppercase tracking-widest px-2">
            <Folder size={14} className="opacity-50" />
            {group.displayName}
          </div>

          <div className="flex flex-col gap-1">
            {group.files.map((file, fileIndex) => {
              const isSelected = selectedIds.includes(file.link);
              const isDownloaded = downloadedIds.includes(file.link);

              // Stagger animation logic
              const delay = groupIndex * 15 + fileIndex * 5;
              const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const translateY = interpolate(frame, [delay, delay + 10], [10, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              return (
                <div
                  key={file.link}
                  style={{
                    opacity,
                    transform: `translateY(${translateY}px)`,
                  }}
                  className={`
                        flex items-center gap-4 p-3 rounded-lg border border-transparent transition-all cursor-pointer group
                        ${
                          isDownloaded
                            ? "bg-[#79be15]/10 border-[#79be15]/20"
                            : isSelected
                            ? "bg-[#79be15]/5 border-[#79be15]/10"
                            : "hover:bg-white/[0.03]"
                        }
                    `}
                >
                  <div
                    className={`
                            relative w-5 h-5 rounded border flex items-center justify-center transition-colors
                            ${
                              isDownloaded
                                ? "bg-[#79be15] border-[#79be15]"
                                : isSelected
                                ? "bg-[#79be15] border-[#79be15]"
                                : "border-[#f3f4f6]/20 group-hover:border-[#79be15]/50"
                            }
                        `}
                  >
                    {(isSelected || isDownloaded) && (
                      <Check size={12} className="text-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-[14px] font-bold truncate ${
                        isDownloaded
                          ? "text-[#79be15]"
                          : isSelected
                          ? "text-[#79be15]"
                          : "text-[#f3f4f6]"
                      }`}
                    >
                      {file.file_name}
                    </div>
                    {file.file_comment && (
                      <div className="text-[12px] text-[#f3f4f6]/30 truncate mt-0.5">
                        {file.file_comment}
                      </div>
                    )}
                  </div>

                  <FileText
                    size={16}
                    className={`transition-opacity ${
                      isDownloaded
                        ? "text-[#79be15]/40"
                        : isSelected
                        ? "text-[#79be15]/40"
                        : "text-[#f3f4f6]/20"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
