import React, { useMemo } from "react";
import { useCurrentFrame, Sequence } from "remotion";
import { SoundEffect } from "./SoundEffect";
import { PRESETS } from "./ProfessionalText/presets";
import { ProfessionalTextProps } from "./ProfessionalText/schema";

/**
 * ProfessionalText: The Universal Antigravity Typewriter Engine.
 */
export const ProfessionalText: React.FC<ProfessionalTextProps> = ({
  text,
  type,
  mode = "typewriter", // Enforced universal mode
  color,
  highlightColor = "#79be15", // Mendelu Green
  animate = true,
  stagger = 3,
}) => {
  const frame = useCurrentFrame();
  const preset = PRESETS[type];
  
  // Advanced character-level highlight parsing
  const parsedCharacters = useMemo(() => {
    const result: { char: string; highlight: boolean }[] = [];
    let isHighlighted = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === "*") {
            isHighlighted = !isHighlighted;
            continue;
        }
        result.push({ char, highlight: isHighlighted });
    }
    return result;
  }, [text]);

  const baseFontSize = preset.fontSize;
  const responsiveFontSize = type === "hook" && text.length > 10 
    ? baseFontSize * (10 / text.length) 
    : baseFontSize;


  const charStagger = Math.max(1, Math.floor(stagger / 2));

  // Visual Engineering: Luminous Mendelu Style (Refined for Inter)
  const luminousStyle: React.CSSProperties = useMemo(() => ({
    color: highlightColor,
    backgroundImage: `linear-gradient(to bottom, #a3e635 0%, #79be15 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: "drop-shadow(0 0 10px rgba(121, 190, 21, 0.4))",
    textShadow: "0 0 15px rgba(121, 190, 21, 0.2)",
    fontWeight: 600, 
  }), [highlightColor]);

  // Base styles (non-highlighted)
  const baseCharStyle: React.CSSProperties = useMemo(() => ({
    backgroundImage: `linear-gradient(to bottom, #FFFFFF 0%, #D0D0D0 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }), []);

  const containerStyle: React.CSSProperties = useMemo(() => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: "0 10%",
    boxSizing: "border-box",
    fontFamily: preset.fontFamily,
    ...preset,
    fontSize: responsiveFontSize,
    color: color ?? preset.color,
    flexWrap: "wrap",
  }), [preset, responsiveFontSize, color]);

  return (
    <div style={containerStyle}>
      {parsedCharacters.map((item, i) => {
        const startFrame = i * charStagger;
        const isVisible = frame >= startFrame;
        
        // Universal Throttled Audio Rhythm
        const shouldClick = i % 2 === 0 && item.char !== " ";

        return (
          <React.Fragment key={i}>
            {isVisible && (
              <Sequence from={startFrame} durationInFrames={1} premountFor={0}>
                {shouldClick && <SoundEffect type="KEYBOARD_CLICK" volume={0.3} />}
              </Sequence>
            )}
            <span
              style={{
                opacity: isVisible ? 1 : 0,
                whiteSpace: "pre",
                ...(item.highlight ? luminousStyle : baseCharStyle)
              }}
            >
              {item.char}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};
