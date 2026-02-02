import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { MM_TO_PX, PRINT_MARGINS, COLORS } from "../../constants/print";

interface PrintWrapperProps {
  children: React.ReactNode;
  showGuides?: boolean;
}

/**
 * PrintWrapper handles the visual "safety" layering for physical print.
 * It visualizes:
 * 1. Bleed Zone (The area that will be trimmed)
 * 2. Safe Zone (Crucial content should stay inside this)
 * 3. Crop Marks (Visual indicators for the cutter)
 */
export const PrintWrapper: React.FC<PrintWrapperProps> = ({
  children,
  showGuides = false,
}) => {
  const { width, height } = useVideoConfig();
  
  const bleedPx = MM_TO_PX(PRINT_MARGINS.BLEED_MM);
  const safeZonePx = MM_TO_PX(PRINT_MARGINS.SAFE_ZONE_MM);

  const trimWidth = width - bleedPx * 2;
  const trimHeight = height - bleedPx * 2;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.DARK }}>
      {/* The Actual Content Container (Includes Bleed) */}
      <AbsoluteFill>
        {children}
      </AbsoluteFill>

      {/* Visual Guides Overlay */}
      {showGuides && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          {/* Bleed Guide (The Trim Line) */}
          <div
            style={{
              position: "absolute",
              top: bleedPx,
              left: bleedPx,
              width: trimWidth,
              height: trimHeight,
              border: `2px dashed ${COLORS.ERROR}`,
              zIndex: 1000,
              boxSizing: "border-box",
            }}
          >
            <span style={{ 
              color: COLORS.ERROR, 
              fontSize: 24, 
              backgroundColor: "rgba(0,0,0,0.7)", 
              padding: "4px 8px" 
            }}>
              TRIM LINE (KEEP BACKGROUND BEYOND THIS)
            </span>
          </div>

          {/* Safe Zone Guide */}
          <div
            style={{
              position: "absolute",
              top: bleedPx + safeZonePx,
              left: bleedPx + safeZonePx,
              width: trimWidth - safeZonePx * 2,
              height: trimHeight - safeZonePx * 2,
              border: `2px dotted ${COLORS.SUCCESS}`,
              zIndex: 1000,
              boxSizing: "border-box",
            }}
          >
            <span style={{ 
              color: COLORS.SUCCESS, 
              fontSize: 24, 
              backgroundColor: "rgba(0,0,0,0.7)", 
              padding: "4px 8px" 
            }}>
              SAFE ZONE (KEEP ALL TEXT INSIDE)
            </span>
          </div>

          {/* Simple Crop Mark Mocks (Corners) */}
          {[
            { top: 0, left: 0 },
            { top: 0, right: 0 },
            { bottom: 0, left: 0 },
            { bottom: 0, right: 0 },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                ...pos,
                width: bleedPx,
                height: bleedPx,
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
