import React from "react";
import { FileText, Check } from "lucide-react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { FileGroup } from "../../../compositions/SubjectDrawer/schema";

interface SubjectDrawerFileListProps {
  groups: FileGroup[];
  selectedIds: string[];
  downloadedIds: string[];
  downloadProgress?: Record<string, number>;
}

export const SubjectDrawerFileList: React.FC<SubjectDrawerFileListProps> = ({
  groups,
  selectedIds,
  downloadedIds,
  downloadProgress = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const allFiles = groups.flatMap((group, groupIndex) => 
    group.files.map((file, fileIndex) => ({
      ...file,
      groupIndex,
      fileIndex
    }))
  );

  return (
    <div className="p-3 bg-transparent min-h-full font-inter relative overflow-hidden">
      <div className="flex flex-col gap-0.5">
        {allFiles.map((file, index) => {
          const isSelected = selectedIds.includes(file.link);
          const isDownloaded = downloadedIds.includes(file.link);
          const progress = downloadProgress[file.link] || 0;
          const isDownloading = progress > 0 && progress < 1;

          // Stagger entrance animation
          const delay = index * 2;
          const entranceOpacity = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Celebration animation when file is downloaded (spring bounce)
          let celebrationScale = 1;
          let celebrationGlow = 0;
          if (isDownloaded) {
            // Find when this file was marked as downloaded (staggered at 226, 236, 246)
            const downloadedIndex = downloadedIds.indexOf(file.link);
            const celebrationStartFrame = 226 + (downloadedIndex * 10);
            
            if (frame >= celebrationStartFrame) {
              const celebrationProgress = spring({
                frame: frame - celebrationStartFrame,
                fps,
                config: { damping: 10, mass: 0.3 },
              });
              
              celebrationScale = interpolate(celebrationProgress, [0, 1], [1, 1.05], {
                extrapolateRight: "clamp",
              });
              
              celebrationGlow = interpolate(celebrationProgress, [0, 0.5, 1], [0, 1, 0.3], {
                extrapolateRight: "clamp",
              });
            }
          }

          // Progress ring SVG calculations
          const radius = 7;
          const circumference = 2 * Math.PI * radius;
          const progressOffset = circumference * (1 - progress);

          return (
            <div
              key={file.link}
              style={{ 
                opacity: entranceOpacity,
                transform: `scale(${celebrationScale})`,
              }}
              className={`
                    flex items-center gap-3 p-2 rounded-lg border border-transparent relative overflow-hidden group
                    ${
                      isDownloaded
                        ? "bg-[#10b981]/5 border-[#10b981]/10"
                        : isDownloading || isSelected
                        ? "bg-[#79be15]/5 border-[#79be15]/10"
                        : "hover:bg-white/[0.02]"
                    }
                `}
            >
              {/* Checkbox / Progress Ring */}
              <div className="relative w-4 h-4 flex items-center justify-center">
                {isDownloading ? (
                  // Progress Ring
                  <svg width="16" height="16" className="transform -rotate-90">
                    {/* Background ring */}
                    <circle
                      cx="8"
                      cy="8"
                      r={radius}
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="2"
                      fill="none"
                    />
                    {/* Progress ring */}
                    <circle
                      cx="8"
                      cy="8"
                      r={radius}
                      stroke="#79be15"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={progressOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  // Checkbox
                  <div
                    className={`
                        w-4 h-4 rounded border flex items-center justify-center
                        ${
                          isDownloaded
                            ? "bg-[#10b981] border-[#10b981]"
                            : isSelected
                            ? "bg-[#79be15] border-[#79be15]"
                            : "border-white/10"
                        }
                    `}
                    style={
                      isDownloaded
                        ? {
                            boxShadow: `0 0 ${20 * celebrationGlow}px rgba(16, 185, 129, ${celebrationGlow})`,
                          }
                        : {}
                    }
                  >
                    {(isSelected || isDownloaded) && (
                      <Check size={10} className="text-white" strokeWidth={4} />
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={`text-[11px] font-bold tracking-tight truncate ${
                    isDownloaded
                      ? "text-[#10b981]"
                      : isDownloading || isSelected
                      ? "text-[#79be15]"
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
                    isDownloaded
                      ? "text-[#10b981]/50"
                      : isDownloading || isSelected
                      ? "text-[#79be15]/50"
                      : "text-white/10"
                  }
                />
                
                {isDownloaded && (
                  <div 
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#10b981] rounded-full border border-[#1a1f26]"
                    style={{
                      boxShadow: `0 0 ${12 * celebrationGlow}px rgba(16, 185, 129, ${celebrationGlow})`,
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
