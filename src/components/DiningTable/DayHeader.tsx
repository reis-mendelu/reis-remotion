import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { WeeklyCalendarDay } from "../reis/WeeklyCalendarDay";
import { BlockLesson } from "../reis/types";

// SVG Chef Hat — matches the outlined green toque in the REIS screenshot
const ChefHatIcon: React.FC<{ size?: number; color?: string; glowing?: boolean }> = ({
  size = 28,
  color = "#4ade80",
  glowing = false,
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
    style={{
      filter: glowing ? `drop-shadow(0 0 6px ${color})` : "none",
    }}
  >
    {/* Chef hat shape */}
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
    <line x1="6" y1="17.5" x2="18" y2="17.5" />
  </svg>
);

interface DayHeaderProps {
  date: number;
  dayName: string;
  iconPulse?: boolean;
  animate?: boolean;
  lessons?: BlockLesson[];
  startHour?: number;
  endHour?: number;
}

export const DayHeader: React.FC<DayHeaderProps> = ({
  date,
  dayName,
  iconPulse = false,
  animate = true,
  lessons = [],
  startHour = 7,
  endHour = 17,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TOTAL_HOURS = endHour - startHour;

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.7 },
    durationInFrames: 25,
  });

  const containerStyle: React.CSSProperties = {
    opacity: animate ? enterSpring : 1,
    transform: `scale(${animate ? enterSpring : 1})`,
    transformOrigin: "center center",
  };

  // Icon pulse: gentle scale on tap
  const pulseScale = iconPulse
    ? 1 + 0.25 * Math.sin(((frame % 20) / 20) * Math.PI)
    : 1;

  const CARD_WIDTH = 200;
  const CARD_HEIGHT = 500;

  return (
    <div style={{ ...containerStyle, position: "relative" }}>
      <div
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          background: "#1f2937",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // CENTERED
            justifyContent: "center",
            padding: "12px 14px 10px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "#111827",
            flexShrink: 0,
            position: "relative", // For absolute icon
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 20, // Smaller like in the 2nd pic
                fontWeight: 700,
                color: "#ffffff", // WHITE
                lineHeight: 1,
                fontFamily: "Inter, sans-serif",
                letterSpacing: "0.02em",
              }}
            >
              {date}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#ffffff", // WHITE
                marginTop: 2,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {dayName}
            </span>
          </div>

          {/* Chef hat icon — moved to absolute corner */}
          <div
            style={{
              position: "absolute",
              right: 14,
              top: 14,
              transform: `scale(${pulseScale})`,
              transformOrigin: "center center",
            }}
          >
            <ChefHatIcon size={22} color="#4ade80" glowing={iconPulse} />
          </div>
        </div>

        {/* Calendar body with time sidebar + event cards */}
        <div style={{ flex: 1, display: "flex", position: "relative" }}>
          {/* Hour sidebar */}
          <div
            style={{
              width: 36,
              background: "#111827",
              borderRight: "1px solid rgba(255,255,255,0.04)",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {[...Array(TOTAL_HOURS)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "100%",
                  top: `${(i / TOTAL_HOURS) * 100}%`,
                  transform: "translateY(-50%)",
                  textAlign: "center",
                  fontSize: 10,
                  color: "#6b7280",
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {i + startHour}
              </div>
            ))}
          </div>

          {/* Grid + event area */}
          <div style={{ flex: 1, position: "relative", background: "#1f2937" }}>
            {/* Hour grid lines */}
            {[...Array(TOTAL_HOURS + 1)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "100%",
                  top: `${(i / TOTAL_HOURS) * 100}%`,
                  borderTop: "1px solid rgba(255,255,255,0.04)",
                }}
              />
            ))}

            {/* Calendar event cards (re-using the existing WeeklyCalendarDay) */}
            <WeeklyCalendarDay
              dayIndex={4}
              lessons={lessons}
              holiday={null}
              isToday={true}
              startHour={startHour}
              endHour={endHour}
              animated={false} // Disabling stagger animation as subjects should be already in schedule
            />
          </div>
        </div>
      </div>
    </div>
  );
};
