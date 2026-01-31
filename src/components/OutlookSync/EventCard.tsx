import React from "react";
import { spring, interpolate, useVideoConfig } from "remotion";
import { Clock } from "lucide-react";

interface EventCardProps {
  title: string;
  time: string;
  progress: number;
  index: number;
  type: "lecture" | "exam" | "exercise";
}

export const EventCard: React.FC<EventCardProps> = ({ title, time, progress, index, type }) => {
  const { fps } = useVideoConfig();
  
  const isExam = type === "exam";
  
  // Stagger start: each card starts 10 frames after the previous one
  const staggerStart = index * 10;
  const cardSpring = spring({
    frame: progress * 60 - staggerStart,
    fps,
    config: { damping: 15 },
  });

  const opacity = interpolate(cardSpring, [0, 1], [0, 1]);
  const translateX = interpolate(cardSpring, [0, 1], [20, 0]);
  const scale = interpolate(cardSpring, [0, 1], [0.95, 1]);

  if (cardSpring <= 0) return null;

  return (
    <div 
      className="flex items-center gap-4 p-3 rounded-xl border border-white/10 mb-2.5 last:mb-0 relative overflow-hidden shadow-lg"
      style={{
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
        transformStyle: "preserve-3d",
        backgroundColor: "rgba(22, 27, 34, 0.4)", // Translucent base
        backdropFilter: "blur(12px)", // Glassmorphism
      }}
    >
      {/* Surface Elevation Highlight */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" 
        style={{ transform: "translateZ(1px)" }}
      />

      {/* Category Accent */}
      <div 
        className={`w-1 h-8 rounded-full ${isExam ? "bg-[#f85149]" : "bg-primary"}`} 
        style={{ transform: "translateZ(2px)" }} 
      />
      
      <div className="flex flex-col gap-1 flex-1 items-start text-left" style={{ transform: "translateZ(3px)" }}>
        {/* Desaturated Event Type Tag - Czech Translation */}
        <span className={`text-[8px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-md ${isExam ? "bg-[#f85149]/20 text-[#f85149]/90" : "bg-primary/20 text-primary/90"}`}>
          {type === "lecture" ? "přednáška" : type === "exam" ? "zkouška" : "cvičení"}
        </span>
        
        <div className="text-[12px] font-semibold text-[#f0f6fc] leading-tight tracking-tight">
          {title}
        </div>
        
        <div className="flex items-center gap-1.5 mt-0.5">
          <Clock size={10} className="text-[#8b949e]" />
          <span className="text-[10px] text-[#8b949e] font-medium tracking-wide font-mono">
            {time}
          </span>
        </div>
      </div>
    </div>
  );
};
