import React from "react";
import { Download, Check, Loader2 } from "lucide-react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import type { Subject } from "../../compositions/SubjectDrawer/schema";

interface SubjectDrawerHeaderProps {
  subject: Subject;
  selectedCount?: number;
  activeTab?: "files" | "syllabus" | "stats";
  isDone?: boolean;
  buttonState?: 'hidden' | 'ready' | 'clicking' | 'downloading' | 'complete';
}

export const SubjectDrawerHeader: React.FC<SubjectDrawerHeaderProps> = ({
  subject,
  selectedCount = 0,
  activeTab = "files",
  isDone = false,
  buttonState = 'hidden',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Button entrance animation (spring from frame 56)
  const buttonEntrance = buttonState !== 'hidden' 
    ? spring({
        frame: frame - 56,
        fps,
        config: { damping: 15, mass: 0.5 },
      })
    : 0;

  const buttonOpacity = buttonState === 'hidden' ? 0 : interpolate(buttonEntrance, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Button opacity with fade-out when complete (approved UX improvement)
  const buttonOpacity = buttonState === 'hidden'
    ? 0
    : buttonState === 'complete'
    ? interpolate(frame - 166, [0, 30], [1, 0], { extrapolateRight: "clamp" })  // Fade out over 1s after completion at frame 166
    : 1;

  const buttonScale = buttonState === 'clicking'
    ? 0.95  // Click down animation
    : interpolate(buttonEntrance, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
      });


  // Button colors - unified brand green for all states
  const backgroundColor = '#79be15';  // Brand color for all states

  const shadowColor = 'rgba(121, 190, 21, 0.3)';  // Brand shadow

  return (
    <div className="px-8 py-6 bg-[#1a1f26] z-20 font-inter flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {/* Title Area */}
        <div className="flex items-center justify-between pb-1">
          <h1 className="text-white font-bold text-xl leading-tight flex-1 overflow-hidden" style={{ lineHeight: '1.3' }}>
            {subject.name}
          </h1>
          
          {/* Download Button - Enhanced with buttonState */}
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-[10px]"
            style={{ 
              opacity: buttonOpacity,
              transform: `scale(${buttonScale})`,
              backgroundColor,
              boxShadow: buttonState !== 'hidden' ? `0 0 25px ${shadowColor}` : 'none',
              transition: 'background-color 0.3s ease',
            }}
          >
            {buttonState === 'complete' ? (
              <Check size={14} strokeWidth={4} className="text-white" />
            ) : buttonState === 'downloading' ? (
              <Loader2 
                size={14} 
                strokeWidth={3} 
                className="text-white animate-pulse"
              />
            ) : (
              <Download size={14} strokeWidth={3} className="text-white" />
            )}
            <span className="text-white">
              {buttonState === 'complete' 
                ? "Staženo" 
                : buttonState === 'downloading'
                ? "Stahování..."
                : `Stáhnout ${selectedCount} soubory`}
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
                    pb-3 text-[13px] font-bold border-b-2 transition-colors cursor-pointer
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
