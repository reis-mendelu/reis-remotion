import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "../Background";
import { ProfessionalText } from "../ProfessionalText";
import { COLORS, MM_TO_PX } from "../../constants/print";

interface PosterLayoutProps {
  title: string;
  subtitle?: string;
  date?: string;
  location?: string;
  ctaText?: string;
  qrCodeUrl?: string;
}

/**
 * PosterLayout: A Swiss Design inspired modular grid for the reIS project.
 * Uses a 12-column grid to maintain professional hierarchy and order.
 */
export const PosterLayout: React.FC<PosterLayoutProps> = ({
  title,
  subtitle,
  date,
  location,
  ctaText = "vše na tři kliky",
}) => {
  // Use professional margins (Safe Zone)
  const margin = MM_TO_PX(15); 

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.DARK, overflow: "hidden" }}>
      {/* 1. Background Layer */}
      <Background type="stars" starsCount={800} />

      {/* 2. Content Layer (Reinforced Stacking) */}
      <AbsoluteFill
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "repeat(10, 1fr)", // Increased granularity
          gap: "24px",
          padding: margin,
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Header / Hook Section (Top) */}
        <div style={{ gridColumn: "1 / span 12", gridRow: "2 / span 3", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <ProfessionalText 
            text={title || "TITLE MISSING"} 
            type="hook" 
            mode="minimalist" 
            animate={false} 
            padding="0"
          />
          {subtitle && (
            <div style={{ marginTop: 20 }}>
              <ProfessionalText 
                  text={subtitle} 
                  type="subtext" 
                  mode="refined" 
                  animate={false} 
                  padding="0"
              />
            </div>
          )}
        </div>

        {/* Info Blocks (Middle) */}
        <div style={{ gridColumn: "1 / span 4", gridRow: "6 / span 2" }}>
           <div style={{ borderTop: `4px solid ${COLORS.BRAND}`, paddingTop: 20 }}>
             <ProfessionalText text="KDY" type="subtext" mode="whisper" animate={false} padding="0" />
             <div style={{ marginTop: 10 }}>
               <ProfessionalText text={date || "ÚNOR 2026"} type="subtext" mode="refined" animate={false} padding="0" />
             </div>
           </div>
        </div>

        <div style={{ gridColumn: "4 / span 9", gridRow: "6 / span 2" }}>
           <div style={{ borderTop: `4px solid ${COLORS.BRAND}`, paddingTop: 20 }}>
             <ProfessionalText text="KDE" type="subtext" mode="whisper" animate={false} padding="0" />
             <div style={{ marginTop: 10 }}>
               <ProfessionalText text={location || "PROVOZNĚ EKONOMICKÁ FAKULTA"} type="subtext" mode="refined" animate={false} padding="0" />
             </div>
           </div>
        </div>

        {/* Bottom Section (CTA + QR) */}
        <div style={{ 
            gridColumn: "1 / span 12", 
            gridRow: "9 / span 2", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-end",
            borderTop: `1px solid rgba(255,255,255,0.1)`,
            paddingTop: 40
        }}>
          <div style={{ flex: 1 }}>
            <ProfessionalText text={ctaText} type="cta" mode="refined" animate={false} padding="0" />
            <div style={{ marginTop: 10 }}>
              <ProfessionalText text="MODERNIZOVANÝ REIS PRO KAŽDÉHO STUDENTA" type="subtext" mode="whisper" animate={false} padding="0" />
            </div>
          </div>
          
          <div style={{ 
              marginLeft: 40,
              width: 350, 
              height: 350, 
              backgroundColor: "white", 
              padding: 20,
              borderRadius: 16,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)"
          }}>
             <div style={{ 
                 width: "100%", 
                 height: "100%", 
                 border: "6px solid black",
                 display: "flex",
                 justifyContent: "center",
                 alignItems: "center",
                 color: "black",
                 fontWeight: 900,
                 fontSize: 48
             }}>
                 QR
             </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
