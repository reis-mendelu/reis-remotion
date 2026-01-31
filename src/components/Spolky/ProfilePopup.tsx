import React from 'react';
import { Moon, MessageSquarePlus } from 'lucide-react';
import { SpolkySection } from './SpolkySection';
import { VideoOutlookSyncToggle } from '../OutlookSync/Toggle';
import { interpolate } from 'remotion';

interface ProfilePopupProps {
  spolkyExpanded: boolean;
  subscribedIds: string[];
  focusProgress?: number;
  highlightId?: string;
}

export const ProfilePopup: React.FC<ProfilePopupProps> = ({ 
  spolkyExpanded, 
  subscribedIds,
  focusProgress = 0, 
  highlightId,
}) => {
  const isSub = (id: string) => subscribedIds.includes(id);

  // Fade out other elements based on focusProgress (0 -> 1)
  // When focusProgress is 1, opacity of others is 0.2 (dimmed) or 0 (gone)?
  // Let's dim them heavily to 0
  const dimOpacity = interpolate(focusProgress, [0, 1], [1, 0]);

  return (
    <div className="w-72 bg-[#1d232a] rounded-xl shadow-2xl border border-white/10 p-3 relative overflow-hidden">
        {/* Faux "Thickness" - Layered borders to simulate a 3D side */}
        <div 
            className="absolute inset-0 rounded-xl bg-[#1d232a] border border-white/10"
            style={{ transform: "translateZ(-2px)" }}
        />
        
        {/* Header */}
        <div 
            className="px-1 py-1 border-b border-white/10 mb-3 relative z-10"
            style={{ opacity: dimOpacity }}
        >
            <h3 className="font-semibold text-white">Nastavení</h3>
        </div>

        {/* Feedback Button (Mock) */}
        <div 
            className="w-full flex items-center gap-3 px-1 py-2 rounded-lg mb-2 opacity-50 relative z-10"
            style={{ opacity: dimOpacity * 0.5 }} // Combine existing opacity
        >
            <MessageSquarePlus size={16} className="text-primary" />
            <span className="text-xs font-medium text-white">Nahlásit chybu / Nápad</span>
        </div>

        {/* Spolky Section - THE FOCUS - explicit z-index/transform to pop out? */}
        <div style={{ transform: `translateZ(${focusProgress * 20}px)` }}>
            <SpolkySection expanded={spolkyExpanded} isSub={isSub} highlightId={highlightId} />
        </div>

        <div 
            className="opacity-50 mt-2 relative z-10"
            style={{ opacity: dimOpacity * 0.5 }}
        >
             <VideoOutlookSyncToggle 
                enabled={false} 
                loading={false} 
                showInfo={false} 
                progress={0} 
             />
        </div>

        {/* Dark Mode Toggle (Mocked as ON) */}
        <div className="relative z-10" style={{ opacity: dimOpacity }}>
            <div className="flex items-center justify-between gap-3 px-1 py-2 rounded-lg">
                <div className="flex items-center gap-2 flex-1">
                    <Moon size={16} className="text-white/50" />
                    <span className="text-xs opacity-70 text-white">Tmavý režim</span>
                </div>
                <input 
                    type="checkbox" 
                    className="toggle toggle-primary toggle-sm" 
                    checked={true} 
                    readOnly 
                />
            </div>
        </div>
    </div>
  );
};
