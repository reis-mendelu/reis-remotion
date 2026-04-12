import React from 'react';
import TransitionSeries from 'remotion-transition-series';
import { ReelProps } from '../schemas/director';
import { AbsoluteFill, Audio, Sequence } from 'remotion';
import { Transition } from '@remotion/transitions';
import { SubjectDrawerScene } from '../components/ui/SubjectDrawerScene';
import { OutlookSyncScene } from '../components/ui/OutlookSyncScene';
import { CalendarScene } from '../components/ui/CalendarScene';
import { SearchBarScene } from '../components/ui/SearchBarScene';
import { KineticText } from '../components/ui/KineticText';
import { BrandedEndSlide } from './BrandedEndSlide';
import { SoundEffect } from '../components/SoundEffect';

export const ReelDirector: React.FC<ReelProps> = ({ actions, theme, backgroundMusic }) => {
  const themeColors = {
    success: '#79BE15',
    warning: '#F59E0B',
    info: '#3B82F6',
    dark: '#111',
  };

  const children = actions.flatMap((action, i) => {
    const sequence = (
      <TransitionSeries.Sequence key={`seq-${i}`} durationInFrames={action.durationInFrames}>
        <AbsoluteFill className="flex flex-col items-center justify-center">
          
          {/* Sound Effect for the start of the action */}
          {action.soundEffect && (
            <SoundEffect type={action.soundEffect} volume={0.4} />
          )}

          {/* Background Glow Overlay Layer (Purely 2D) */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(circle at center, ${themeColors[theme]} 0%, transparent 70%)`,
            }}
          />

          {/* Content Layer */}
          {(action.type === 'subject-drawer-demo' || action.type === 'subject-stats-demo') && action.subjectProps && (
            <SubjectDrawerScene {...action.subjectProps} />
          )}

          {action.type === 'search-bar-demo' && action.searchProps && (
            <SearchBarScene {...action.searchProps} />
          )}

          {action.type === 'outlook-sync-demo' && (
            <OutlookSyncScene />
          )}

          {action.type === 'calendar-showcase' && (
            <CalendarScene />
          )}

          {action.type === 'end-card' && action.endCardProps && (
             <BrandedEndSlide 
                logoScale={action.endCardProps.logoScale} 
                theme="dark" 
                animate={true} 
                ctaText={action.endCardProps.ctaText} 
             />
          )}
          
          {/* Kinetic Text Overlay Layer */}
          {action.text && (
            <>
              <div className="absolute inset-0 bg-black/10 z-40 backdrop-blur-[1px]" />
              <KineticText 
                text={action.text} 
                themeColor={themeColors[theme]} 
                fontSize={80} 
                className="absolute z-50 pointer-events-none"
              />
            </>
          )}
        </AbsoluteFill>
      </TransitionSeries.Sequence>
    );

    if (action.transitionOut === 'fade') {
      return [
        sequence,
        <TransitionSeries.Transition
          key={`trans-${i}`}
          durationInFrames={15}
          transitionComponent={({ progress }) => (
            <AbsoluteFill style={{ opacity: progress, backgroundColor: '#111' }} />
          )}
        />
      ];
    }

    return [sequence];
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#111' }}>
      {backgroundMusic && (
        <Audio src={backgroundMusic} volume={0.2} loop />
      )}
      <TransitionSeries>
        {children}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
