import React from "react";
import { FolderDown } from "lucide-react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface DownloadFolderProps {
  downloadedCount: number;
  totalCount: number;
  isVisible: boolean;
  isComplete: boolean;
}

export const DownloadFolder: React.FC<DownloadFolderProps> = ({
  downloadedCount,
  totalCount,
  isVisible,
  isComplete,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation - slide in from bottom-right (frame 106)
  const entranceProgress = isVisible
    ? spring({
        frame: frame - 106,
        fps,
        config: { damping: 12, mass: 0.4 },
      })
    : 0;

  const slideY = interpolate(entranceProgress, [0, 1], [100, 0], {
    extrapolateRight: "clamp",
  });

  const slideX = interpolate(entranceProgress, [0, 1], [50, 0], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Celebration animation when complete (frame 186)
  let celebrationScale = 1;
  let celebrationGlow = 0;
  if (isComplete && frame >= 186) {
    const celebrationProgress = spring({
      frame: frame - 186,
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

  if (!isVisible) return null;

  return (
    <div
      className="absolute font-inter"
      style={{
        bottom: 16,
        right: 16,
        transform: `translate(${slideX}px, ${slideY}px) scale(${celebrationScale})`,
        opacity,
      }}
    >
      <div
        className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1f26] border border-white/10"
        style={{
          boxShadow: isComplete
            ? `0 0 ${20 * celebrationGlow}px rgba(121, 190, 21, ${celebrationGlow * 0.4})`
            : "0 2px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Folder Icon */}
        <div className="relative">
          <FolderDown
            size={32}
            className={isComplete ? "text-[#79be15]" : "text-[#79be15]/70"}
            strokeWidth={2}
          />
          
          {/* Badge Counter */}
          {downloadedCount > 0 && (
            <div
              className={`
                absolute -top-1 -right-1 
                min-w-[16px] h-[16px] px-1
                rounded-full 
                flex items-center justify-center
                text-[8px] font-bold
                ${
                  isComplete
                    ? "bg-[#79be15] text-white"
                    : "bg-[#79be15] text-white"
                }
              `}
              style={{
                boxShadow: isComplete
                  ? `0 0 ${10 * celebrationGlow}px rgba(16, 185, 129, ${celebrationGlow})`
                  : "0 1px 3px rgba(0, 0, 0, 0.2)",
              }}
            >
              {downloadedCount}/{totalCount}
            </div>
          )}
        </div>

        {/* Label */}
        <div className="text-[9px] font-bold text-white/60 uppercase tracking-wide">
          {isComplete ? "Staženo" : "Stahování..."}
        </div>
      </div>
    </div>
  );
};
