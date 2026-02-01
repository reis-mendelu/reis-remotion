import React, { useMemo } from "react";
import { useCurrentFrame, Sequence, spring, useVideoConfig, interpolate } from "remotion";
import { SoundEffect } from "./SoundEffect";
import { PRESETS } from "./ProfessionalText/presets";
import { ProfessionalTextProps } from "./ProfessionalText/schema";

/**
 * ProfessionalText: The Universal Antigravity Typewriter Engine.
 */
export const ProfessionalText: React.FC<ProfessionalTextProps> = ({
  text,
  type,
  mode = "typewriter", 
  color,
  highlightColor = "#79be15", 
  animate = true,
  stagger = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const preset = PRESETS[type];
  
  const isMinimalist = mode === "minimalist";
  const isRefined = mode === "refined";
  const isWhisper = mode === "whisper";
  
  // Determine text transform based on mode
  const shouldTransformText = isMinimalist;

  // Advanced character-level highlight parsing
  const parsedCharacters = useMemo(() => {
    const result: { char: string; highlight: boolean }[] = [];
    let isHighlighted = false;
    const processingText = shouldTransformText ? text.toUpperCase() : text;
    
    for (let i = 0; i < processingText.length; i++) {
        const char = processingText[i];
        if (char === "*") {
            isHighlighted = !isHighlighted;
            continue;
        }
        result.push({ char, highlight: isHighlighted });
    }
    return result;
  }, [text, isMinimalist]);

  const baseFontSize = preset.fontSize;
  const responsiveFontSize = type === "hook" && text.length > 10 
    ? baseFontSize * (10 / text.length) 
    : baseFontSize;


  const charStagger = isMinimalist ? 0 : Math.max(1, Math.floor(stagger / 2));

  // Spring for minimalist simultaneous reveal
  const introSpring = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  const springOpacity = interpolate(introSpring, [0, 0.5], [0, 1]);
  const springScale = interpolate(introSpring, [0, 1], [0.95, 1]);

  // Visual Engineering: Titanium & Emerald (Professional Finish)
  const luminousStyle: React.CSSProperties = useMemo(() => {
    if (isMinimalist) return { color: "white", fontWeight: 900 };
    if (isRefined) return { color: highlightColor, fontWeight: 600 };
    if (isWhisper) return { color: highlightColor, fontWeight: 400 };
    return {
      color: highlightColor,
      backgroundImage: `linear-gradient(to bottom, #52cc7a 0%, #166534 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      filter: "drop-shadow(0 0 6px rgba(18, 101, 52, 0.4))",
      textShadow: "0 0 8px rgba(18, 101, 52, 0.2)",
      fontWeight: 600, 
    };
  }, [highlightColor, isMinimalist, isRefined, isWhisper]);

  // Titanium Slate Style (non-highlighted)
  const baseCharStyle: React.CSSProperties = useMemo(() => {
    if (isMinimalist) return { color: "white", fontWeight: 900 };
    if (isRefined) return { color: "white", fontWeight: 600 };
    if (isWhisper) return { color: "#CBD5E1", fontWeight: 400 };
    return {
      backgroundImage: `linear-gradient(to bottom, #F8FAFC 0%, #CBD5E1 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    };
  }, [isMinimalist, isRefined, isWhisper]);

  const containerStyle: React.CSSProperties = useMemo(() => {
    const shouldAnimate = isMinimalist;
    return {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      padding: "0 10%",
      boxSizing: "border-box",
      fontFamily: preset.fontFamily,
      ...preset,
      fontSize: responsiveFontSize,
      color: isMinimalist ? "white" : (color ?? preset.color),
      flexWrap: "wrap",
      textTransform: isMinimalist ? "uppercase" : "none",
      letterSpacing: isMinimalist ? "4px" : preset.letterSpacing,
      opacity: shouldAnimate ? springOpacity : 1,
      transform: shouldAnimate ? `scale(${springScale})` : "none",
    };
  }, [preset, responsiveFontSize, color, isMinimalist, springOpacity, springScale]);

  return (
    <div style={containerStyle}>
      {parsedCharacters.map((item, i) => {
        const startFrame = i * charStagger;
        const isVisible = frame >= startFrame;
        
        // Universal Throttled Audio Rhythm - only for non-minimalist typewriter
        const shouldClick = !isMinimalist && i % 2 === 0 && item.char !== " ";

        return (
          <React.Fragment key={i}>
            {!isMinimalist && isVisible && (
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
