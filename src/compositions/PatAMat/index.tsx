import React from 'react';
import { AbsoluteFill, Video, Img, staticFile, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { SoundEffect } from '../../components/SoundEffect';
import { Background } from '../../components/Background';

export const PatAMatComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  const videoDuration = Math.round(5.18 * fps); // Cut at 5.18 seconds
  const leafletDuration = 5 * fps; // 5 seconds
  const endSlideDuration = 2 * fps; // 2 seconds
  
  const leafletStart = videoDuration;
  const endSlideStart = leafletStart + leafletDuration;

  // Leaflet Animation
  const leafletOpacity = interpolate(
    frame,
    [leafletStart, leafletStart + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const leafletScale = spring({
    frame: frame - leafletStart,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  // End Slide Animations
  const endSlideEntrance = spring({
    frame: frame - endSlideStart,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  const logoScale = interpolate(endSlideEntrance, [0, 1], [0.8, 1.2]);
  const logoOpacity = interpolate(endSlideEntrance, [0, 0.5], [0, 1]);

  // Responsive logo size matching BrandedEndSlide scale
  const baseLogoSize = Math.min(width, height) * 0.14 * 1.5;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0c10' }}>
      
      {/* 1. Video Sequence */}
      <Sequence durationInFrames={videoDuration}>
        <AbsoluteFill>
          <Video 
            src={staticFile("patamat_eduoram.mp4")} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 2. Leaflet Sequence (Dark Theme) */}
      <Sequence from={leafletStart} durationInFrames={leafletDuration}>
        {frame === leafletStart && <SoundEffect type="SUCCESS" volume={0.5} />}
        <AbsoluteFill className="flex items-center justify-center bg-[#0a0c10]">
           <Background type="stars" starsCount={300} />
           <div style={{
             opacity: leafletOpacity,
             transform: `scale(${leafletScale})`,
             width: '100%',
             height: '100%',
             padding: '20px',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center'
           }}>
             <Img 
                src={staticFile("eduroam_ig_transparent.png")} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                }} 
             />
           </div>
        </AbsoluteFill>
      </Sequence>

      {/* 3. End Slide (Collaboration) */}
      <Sequence from={endSlideStart}>
        <AbsoluteFill className="flex items-center justify-center bg-[#0a0c10]">
          <Background type="stars" starsCount={300} />
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "40px",
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            zIndex: 10,
          }}>
            {/* Dual Logos */}
            <div style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "40px",
            }}>
              <Img
                src={staticFile("reIS_logo.png")}
                style={{
                  width: `${baseLogoSize}px`,
                  height: `${baseLogoSize}px`,
                  objectFit: "contain",
                }}
                alt="reIS Logo"
              />
              
              <span style={{ 
                color: "#444", 
                fontSize: "60px", 
                fontWeight: "300",
                fontFamily: "Inter-Medium"
              }}>×</span>
              
              <Img
                src={staticFile("patamat_profile.jpg")}
                style={{
                  width: `${baseLogoSize}px`,
                  height: `${baseLogoSize}px`,
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "5px solid #79BE15"
                }}
                alt="Pat & Mat Logo"
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
      
    </AbsoluteFill>
  );
};
