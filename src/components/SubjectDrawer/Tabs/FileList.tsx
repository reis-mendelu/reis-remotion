import React from "react";
import { FileText, Check } from "lucide-react";
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

  const allFiles = groups.flatMap((group, groupIndex) => 
    group.files.map((file, fileIndex) => ({
      ...file,
      groupIndex,
      fileIndex
    }))
  );

  return (
    <div className="p-3 bg-transparent min-h-full font-inter relative">
      <div className="flex flex-col gap-0.5">
        {allFiles.map((file, index) => {
          const isSelected = selectedIds.includes(file.link);
          const isDownloaded = downloadedIds.includes(file.link);

          // Stagger entrance animation
          const delay = index * 2;
          const entranceOpacity = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={file.link}
              style={{ opacity: entranceOpacity }}
              className={`
                    flex items-center gap-3 p-2 rounded-lg border border-transparent relative overflow-hidden group
                    ${
                      isDownloaded || isSelected
                        ? "bg-[#88d618]/5 border-[#88d618]/10"
                        : "hover:bg-white/[0.02]"
                    }
                `}
            >
              <div
                className={`
                        relative w-4 h-4 rounded border flex items-center justify-center
                        ${
                          isDownloaded || isSelected
                            ? "bg-[#88d618] border-[#88d618]"
                            : "border-white/10"
                        }
                    `}
              >
                {(isSelected || isDownloaded) && (
                  <Check size={10} className="text-white" strokeWidth={4} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={`text-[11px] font-bold tracking-tight truncate ${
                    isDownloaded || isSelected
                      ? "text-[#88d618]"
                      : "text-white/80"
                  }`}
                >
                  {file.file_name}
                </div>
                {file.file_comment && (
                  <div className="text-[9px] text-white/20 font-bold truncate mt-0.5">
                    {file.file_comment}
                  </div>
                )}
              </div>

              <div className="relative">
                <FileText
                  size={12}
                  className={
                    isDownloaded || isSelected
                      ? "text-[#88d618]/50"
                      : "text-white/10"
                  }
                />
                
                {isDownloaded && (
                  <div 
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#88d618] rounded-full border border-[#1a1f26]"
                    style={{
                      boxShadow: "0 0 12px rgba(136, 214, 24, 0.5)"
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
