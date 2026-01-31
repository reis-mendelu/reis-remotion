import React from 'react';
import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { Users, ChevronRight } from 'lucide-react';
import { ASSOCIATION_PROFILES } from '../../services/spolky/config';
import { SoundEffect } from '../SoundEffect';

interface SpolkySectionProps {
  expanded: boolean;
  isSub: (id: string) => boolean;
  highlightId?: string;
}

export const SpolkySection: React.FC<SpolkySectionProps> = ({ expanded, isSub, highlightId }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation for the expansion
  // We assume the expansion starts at frame 30 if "expanded" is true
  // In a real interactive app, this would be state-driven.
  // Here, we drive it by frame if 'expanded' is passed as true.
  
  const EXPANSION_START = 30;
  
  const expansionProgress = spring({
    frame: frame - EXPANSION_START,
    fps,
    config: { damping: 20 },
    durationInFrames: 30, // Force a duration? spring doesn't take durationInFrames directly unless overridden, but config controls it.
  });

  // If not expanded, we just stay closed.
  // We use expansionProgress directly for other animations.

  // Height animation - max height approx 160px based on content
  const height = interpolate(expansionProgress, [0, 1], [0, 160]);
  const opacity = interpolate(expansionProgress, [0, 0.5], [0, 1]);

  // Chevron rotation
  const chevronRotation = interpolate(expansionProgress, [0, 1], [0, 90]);
  
  // Staggered list items
  const items = Object.values(ASSOCIATION_PROFILES);

  return (
    <div className="mt-2 border-t border-white/10">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-1 py-3 group cursor-pointer relative">
        {/* Hover effect simulation */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity" />
        
        <div className="flex items-center gap-2 relative z-10">
          <Users size={16} className="text-white/50 group-hover:text-primary" />
          <span className="text-xs font-medium opacity-70 text-white">Odebírané spolky</span>
        </div>
        
        <div style={{ transform: `rotate(${chevronRotation}deg)` }} className="relative z-10 text-white">
           <ChevronRight size={16} />
        </div>
      </div>

      {/* Dropdown Content */}
      <div 
        className="overflow-hidden"
        style={{ 
            height: expanded ? height : 0,
            opacity: expanded ? opacity : 0
        }}
      >
        <div className="space-y-1 mb-2 px-1">
          {items.map((p, index) => {
             // Stagger animation for each item
             // Each item starts animating in slightly after the previous one
             const itemDelay = EXPANSION_START + 10 + (index * 5);
             const itemSpring = spring({
                frame: frame - itemDelay,
                fps,
                config: { damping: 15, stiffness: 100 }
             });
             
             const itemOpacity = interpolate(itemSpring, [0, 1], [0, 1]);
             const itemX = interpolate(itemSpring, [0, 1], [-10, 0]);
             const isChecked = isSub(p.id);
             const isHighlighted = highlightId === p.id;

             return (
               <div 
                 key={p.id} 
                 className={`flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors ${isHighlighted ? 'bg-primary/30 ring-1 ring-primary' : ''}`}
                 style={{ 
                   opacity: itemOpacity,
                   transform: `translateX(${itemX}px)`
                 }}
               >
                 <span className="text-xs opacity-90 text-white">{p.name}</span>
                 <input 
                   type="checkbox" 
                   className="checkbox checkbox-xs checkbox-primary border-primary" 
                   checked={isChecked} 
                   readOnly
                 />
               </div>
             );
          })}
        </div>
      </div>

       {/* Audio Feedback for Expand */}
       {expanded && frame === EXPANSION_START && (
         <SoundEffect type="TOGGLE_ON" volume={0.5} />
       )}
    </div>
  );
};
