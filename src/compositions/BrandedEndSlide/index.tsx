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
import { ProfessionalText } from "../../components/ProfessionalText";

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
        {/* Pure Apple Minimalism - Zero Effects */}
        <div style={{ 
          position: "relative",
          opacity,
          transform: `scale(${scale * logoScale})`,
        }}>
          <img 
            src={logoSrc} 
            style={{ 
              width: "200px", 
              height: "200px", 
              objectFit: "contain",
              display: "block",
            }} 
            alt="Mendelova Univerzita Logo" 
          />
        </div>
        
        {ctaText && (
          <div style={{
            position: "absolute",
            bottom: "30%", // Adjusted for larger CTA text
            width: "100%",
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
            transform: `scale(${interpolate(frame, [50, 100, 150], [1, 1.02, 1], { extrapolateRight: "clamp" })})`, // Subtle pulse
          }}>
            <ProfessionalText 
              text={ctaText}
              type="cta"
              mode="refined"
              animate={false}
            />
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
