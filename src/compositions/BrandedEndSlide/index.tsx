import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  spring,
  Img,
} from "remotion";
import { BrandedEndSlideProps } from "./schema";
import { Background } from "../../components/Background";

export const BrandedEndSlide: React.FC<BrandedEndSlideProps> = ({
  logoScale = 1,
  theme = "dark",
  ctaText,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const logoSrc = staticFile("reIS_logo.png");

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  // Responsive logo size: 14% of the shortest dimension works for both
  // landscape (1920×1080 → 151px) and portrait reels (1080×1920 → 151px)
  // logoScale is then applied on top for fine-tuning per composition
  const baseLogoSize = Math.min(width, height) * 0.14 * logoScale;

  // Logo animation: simple scale and fade (Apple-style)
  const scale = interpolate(entrance, [0, 1], [0.8, 1.2]);
  const opacity = interpolate(entrance, [0, 0.5], [0, 1]);

  return (
    <AbsoluteFill style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#0a0c10" : "white",
    }}>
      {theme === "dark" ? (
        <Background type="stars" starsCount={300} />
      ) : (
        <Background type="solid" color="white" />
      )}

      <AbsoluteFill className="items-center justify-center">
        {/* Flex column: logo + CTA always tightly grouped, regardless of aspect ratio */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
          opacity,
          transform: `scale(${scale})`,
          zIndex: 10,
        }}>
          <Img
            src={logoSrc}
            style={{
              width: `${baseLogoSize}px`,
              height: `${baseLogoSize}px`,
              objectFit: "contain",
            }}
            alt="reIS Logo"
          />

          {/* CTA text — fades in after logo settles */}
          {ctaText && (
            <div style={{
              color: "#ffffff",
              fontSize: "60px",
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.01em",
              opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
            }}>
              {ctaText}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
