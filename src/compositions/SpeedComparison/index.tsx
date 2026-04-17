import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Img } from "remotion";
import { Background } from "../../components/Background";
import { SpeedComparisonProps } from "./schema";

// ─── Frame constants ────────────────────────────────────────────────────────
const FONT = "Inter, system-ui, sans-serif";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const tenth = Math.floor((seconds % 1) * 10);
  return `${m}:${String(s).padStart(2, "0")}.${tenth}`;
}

// ─── Done badge — centered celebration, shows the payoff time ───────────────


// ─── Main composition ────────────────────────────────────────────────────────
export const SpeedComparison: React.FC<SpeedComparisonProps> = ({
  isVideoSrc,
  reisVideoSrc,
  isVideoDurationFrames,
  reisVideoDurationFrames,
  isGraceFrames,
  title,
  isLabel,
  reisLabel,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const multiplier = (isVideoDurationFrames / reisVideoDurationFrames).toFixed(1);
  const halfHeight = height / 2;

  // Timing derived from props — works for any video pair
  const FADE_START = reisVideoDurationFrames + isGraceFrames;
  const RACE_END = FADE_START + 30;
  const END_CARD_START = RACE_END;

  // ── ACT 1 & 2: Race timers ──────────────────────────────────────────────
  const reisElapsed = Math.min(frame, reisVideoDurationFrames) / fps;
  const isElapsed = Math.min(frame, isVideoDurationFrames) / fps;



  // Split screen fades out to black
  const splitOpacity = interpolate(frame, [FADE_START, RACE_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title pill: fade in 0–20, stay visible throughout the race,
  // ride the split fade to the end card so late scrollers always see context.
  const titleFadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = titleFadeIn * splitOpacity;

  // ── ACT 3: End card CTA overlay ─────────────────────────────────────────
  const endCTAOpacity = interpolate(frame - END_CARD_START, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>

      {/* ── ACT 1 & 2: Split screen race ──────────────────────────────── */}
      <AbsoluteFill style={{ opacity: splitOpacity }}>

        {/* IS panel — top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height: halfHeight,
            backgroundColor: "#1c1c1e",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Video
            src={staticFile(isVideoSrc)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            endAt={RACE_END}
          />
          <div style={{
            position: "absolute", top: 36, left: 48,
            fontFamily: FONT, fontWeight: 900, fontSize: 44,
            color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 5,
          }}>
            {isLabel}
          </div>
          <div style={{
            position: "absolute", top: 36, right: 48,
            fontFamily: FONT, fontWeight: 800, fontSize: 56,
            color: "rgba(255,255,255,0.92)", letterSpacing: 1,
            fontVariantNumeric: "tabular-nums",
            textShadow: "0 2px 12px rgba(0,0,0,0.6)",
          }}>
            ⏱ {formatTime(isElapsed)}
          </div>
        </div>

        {/* reIS panel — bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width,
            height: halfHeight,
            backgroundColor: "#111111",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Video
            src={staticFile(reisVideoSrc)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            endAt={reisVideoDurationFrames}
          />
          <div style={{
            position: "absolute", bottom: 36, left: 48,
            fontFamily: FONT, fontWeight: 900, fontSize: 44,
            color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 5,
          }}>
            {reisLabel}
          </div>
          <div style={{
            position: "absolute", bottom: 36, right: 48,
            fontFamily: FONT, fontWeight: 800, fontSize: 56,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: 1, fontVariantNumeric: "tabular-nums",
            textShadow: "0 2px 12px rgba(0,0,0,0.6)",
          }}>
            ⏱ {formatTime(reisElapsed)}
          </div>
        </div>

        {/* Divider with title interrupting the line */}
        <div style={{
          position: "absolute", top: halfHeight, left: 0, right: 0,
          display: "flex", alignItems: "center",
          transform: "translateY(-50%)", zIndex: 20,
          opacity: titleOpacity, pointerEvents: "none",
          gap: 24,
        }}>
          {/* Left line segment */}
          <div style={{
            flex: 1, height: 2, backgroundColor: accentColor,
            boxShadow: `0 0 16px ${accentColor}90`,
          }} />
          {/* Label — no box, pure text */}
          <span style={{
            fontFamily: FONT, fontWeight: 600, fontSize: height * 0.0231,
            color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 4,
            whiteSpace: "nowrap",
            textShadow: "0 1px 6px rgba(0,0,0,0.7)",
          }}>
            {title}
          </span>
          {/* Right line segment */}
          <div style={{
            flex: 1, height: 2, backgroundColor: accentColor,
            boxShadow: `0 0 16px ${accentColor}90`,
          }} />
        </div>
      </AbsoluteFill>

      {/* ── ACT 3: End card ───────────────────────────────────────────── */}
      {frame >= END_CARD_START && (
        <Sequence from={END_CARD_START}>
          <AbsoluteFill style={{ backgroundColor: "#0a0c10" }}>
            <Background type="stars" starsCount={300} />

            {/* Logo + CTA in a single column — full layout control */}
            <AbsoluteFill style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 56, zIndex: 10,
            }}>
              {/* Logo — same spring as all official sequences */}
              <div style={{
                opacity: interpolate(
                  spring({ frame: frame - END_CARD_START, fps, config: { damping: 12, stiffness: 100 } }),
                  [0, 0.5], [0, 1]
                ),
                transform: `scale(${interpolate(
                  spring({ frame: frame - END_CARD_START, fps, config: { damping: 12, stiffness: 100 } }),
                  [0, 1], [0.8, 1.2]
                )})`,
              }}>
                <Img
                  src={staticFile("reIS_logo.png")}
                  style={{
                    width: Math.min(width, height) * 0.14 * 1.5,
                    height: Math.min(width, height) * 0.14 * 1.5,
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* CTA — delayed fade, 5× in Mendelu green */}
              <div style={{ opacity: endCTAOpacity, textAlign: "center" }}>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#ffffff" }}>
                  reIS je{" "}
                </span>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: accentColor }}>
                  {multiplier}×
                </span>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#ffffff" }}>
                  {" "}rychlejší
                </span>
              </div>
            </AbsoluteFill>
          </AbsoluteFill>
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
