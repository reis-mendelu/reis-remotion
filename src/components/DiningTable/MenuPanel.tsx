import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

const FOOD_ICON = "🍽️";
const SOUP_ICON = "🥣";

const ChefHatIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 20,
  color = "#4ade80",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
    <line x1="6" y1="17.5" x2="18" y2="17.5" />
  </svg>
);

interface MenuPanelProps {
  tabs: string[];
  activeTab: string;
  items: string[];
  startFrame: number;
  animate?: boolean;
}

export const MenuPanel: React.FC<MenuPanelProps> = ({
  tabs,
  activeTab,
  items,
  startFrame,
  animate = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - startFrame;

  // Panel entrance spring
  const panelSpring = spring({
    frame: relFrame,
    fps,
    config: { damping: 16, stiffness: 150, mass: 0.6 },
    durationInFrames: 25,
  });

  const panelStyle: React.CSSProperties = animate
    ? {
        opacity: panelSpring,
        transform: `scale(${0.8 + 0.2 * panelSpring}) translateY(${(1 - panelSpring) * -20}px)`,
      }
    : {};

  // Tab entrance (appears after panel)
  const TAB_START = 15;
  const tabSpring = spring({
    frame: relFrame - TAB_START,
    fps,
    config: { damping: 14, stiffness: 140, mass: 0.5 },
  });

  // Food items are all shown immediately (no stagger)

  return (
    <div
      style={{
        width: 280,
        background: "#1a2233",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        overflow: "hidden",
        transformOrigin: "top center",
        ...panelStyle,
      }}
    >
      {/* Title row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px 10px",
          borderBottom: "2px solid rgba(255,255,255,0.08)",
        }}
      >
        <ChefHatIcon size={20} color="#4ade80" />
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          Jídelníček
        </span>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          opacity: animate ? tabSpring : 1,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <div
              key={tab}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 0",
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#4ade80" : "#9ca3af",
                borderBottom: isActive ? "2px solid #4ade80" : "2px solid transparent",
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
              }}
            >
              {tab}
            </div>
          );
        })}
      </div>

      {/* Food items — all visible immediately, no stagger */}
      <div style={{ padding: "6px 0" }}>
        {items.map((item, index) => {
          const isSoup = item.toLowerCase().includes("polévka") || item.toLowerCase().includes("soup");

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "6px 16px",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  marginTop: 1,
                  flexShrink: 0,
                  color: "#9ca3af",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {isSoup ? SOUP_ICON : FOOD_ICON}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "#e5e7eb",
                  lineHeight: 1.45,
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
