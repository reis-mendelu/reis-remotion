import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  spring,
} from "remotion";
import { BrandedEndSlideProps } from "./schema";
import { Background } from "../../components/Background";
import { ProfessionalText } from "../../components/ProfessionalText";

export const BrandedEndSlide: React.FC<BrandedEndSlideProps> = ({
  logoScale = 1,
  theme = "dark",
  animate = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSrc = staticFile("mendelu_logo.png");

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  // Logo animation dynamics
  const scale = interpolate(entrance, [0, 1], [0.8 * logoScale, 1.2 * logoScale]);
  const opacity = interpolate(entrance, [0, 0.5], [0, 1]);
  
  // Amplified 3D rotation for dramatic material effect
  const rotationY = interpolate(frame, [0, 150], [-35, 35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rotationX = interpolate(frame, [0, 150], [20, -20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Material Thickness (Pseudo-extrusion)
  const thickness = 12; // pixels
  const layers = Array.from({ length: thickness }).map((_, i) => i);

  // Dynamic Lighting Glint (Moving Highlight)
  const glintPos = interpolate(frame, [0, 150], [-100, 200]);

  const containerStyle: React.CSSProperties = useMemo(() => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme === "dark" ? "#0a0c10" : "white",
  }), [theme]);

  const sharedStyle: React.CSSProperties = {
    position: "absolute",
    width: "200px", // Reduced for smaller, more elegant cube
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    backfaceVisibility: "hidden",
  };

  return (
    <AbsoluteFill style={containerStyle}>
      {theme === "dark" ? (
        <Background type="stars" starsCount={300} />
      ) : (
        <Background type="solid" color="white" />
      )}
      
      <AbsoluteFill className="items-center justify-center">
        {/* The Volumetric Material Stack */}
        <div style={{ 
          position: "relative", 
          width: 200, 
          height: 200,
          perspective: "1500px",
          transformStyle: "preserve-3d",
          transform: `scale(${scale * logoScale}) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
          opacity
        }}>
          {/* Back Plate (Shadow influence) */}
          <div style={{
            ...sharedStyle,
            backgroundColor: "#ffffff",
            transform: `translateZ(-${thickness}px)`,
            boxShadow: theme === "dark" ? "0 0 40px rgba(0,0,0,0.8)" : "0 0 20px rgba(0,0,0,0.1)",
          }} />

          {/* Extrusion layers (The Sides) */}
          {layers.map(i => (
            <div key={i} style={{
              ...sharedStyle,
              backgroundColor: "#e2e8f0",
              transform: `translateZ(-${i}px)`,
              border: "1px solid rgba(0,0,0,0.05)",
            }} />
          ))}

          {/* Front Face (Logo Plate) */}
          <div style={{
            ...sharedStyle,
            backgroundColor: "#ffffff",
            transform: "translateZ(0px)",
            overflow: "hidden", // Clip the glint
            boxShadow: "inset 0 0 2px rgba(0,0,0,0.1)",
          }}>
            <img 
              src={logoSrc} 
              style={{ width: "130px", height: "130px", objectFit: "contain" }} 
              alt="Mendelova Univerzita Logo" 
            />
            
            {/* The Google-style Lighting Glint (Dynamic Highlight) */}
            <div style={{
              position: "absolute",
              top: "-50%",
              left: `${glintPos}%`,
              width: "40%",
              height: "200%",
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
              transform: "rotate(25deg)",
              pointerEvents: "none",
            }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
