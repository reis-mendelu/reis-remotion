import React from "react";
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

export const BrandedEndSlide: React.FC<BrandedEndSlideProps> = ({
  logoScale = 1,
  theme = "dark",
  animate = true,
  ctaText,
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

  // Logo animation dynamics (Apple-style: simple scale and fade only)
  const scale = interpolate(entrance, [0, 1], [0.8 * logoScale, 1.2 * logoScale]);
  const opacity = interpolate(entrance, [0, 0.5], [0, 1]);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme === "dark" ? "#0a0c10" : "white",
  };

  return (
    <AbsoluteFill style={containerStyle}>
      {theme === "dark" ? (
        <Background type="stars" starsCount={300} />
      ) : (
        <Background type="solid" color="white" />
      )}
      
      <AbsoluteFill className="items-center justify-center">
        <div style={{ 
          position: "relative",
          opacity,
          transform: `scale(${scale * logoScale})`,
          zIndex: 10, // Logo layer
          borderRadius: "50%", // Circular clipping
          overflow: "hidden", // Clip content to circle
          width: "120px",
          height: "120px",
          border: "2px solid rgba(255, 255, 255, 0.1)", // Smooth subtle border
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)", // Subtle depth
          backgroundColor: "#ffffff", // Solid white background
        }}>
          <img 
            src={logoSrc} 
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "contain",
              display: "block",
              padding: "10px", // Minimal padding - border at edge of M
            }} 
            alt="Mendelova Univerzita Logo" 
          />
        </div>
        
        {ctaText && (
          <div style={{
            position: "absolute",
            bottom: "26%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
            transform: `scale(${interpolate(frame, [50, 100, 150], [1, 1.02, 1], { extrapolateRight: "clamp" })})`,
            zIndex: 20,
          }}>
            <div style={{ 
              color: "#ffffff", 
              fontSize: "60px", 
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.01em",
            }}>
              {ctaText}
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
