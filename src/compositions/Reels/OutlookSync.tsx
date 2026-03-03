import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  spring,
  interpolate,
  useVideoConfig,
} from "remotion";
import { OutlookSyncComposition } from "../OutlookSync/index";
import { WeeklyCalendar } from "../../components/reis/WeeklyCalendar";
import { SoundEffect } from "../../components/SoundEffect";
import { Background } from "../../components/Background";
import { BrandedEndSlide } from "../BrandedEndSlide";
import { KineticText } from "./components/KineticText";

export const ReelOutlookSync: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- TIMELINE (330 frames = 11s @ 30fps) ---
  // 0-15:    Entrance spring
  // 10-55:   KineticText "ROZVRH V KALENDÁŘI →"
  // 30:      Toggle ON
  // 45-110:  Sync progress 0→100%
  // 110:     Sync complete
  // 120-135: Sync card fades out
  // 130-140: WeeklyCalendar springs in
  // 130-250: Calendar visible (linger)
  // 240-255: Calendar fades out
  // 250-330: BrandedEndSlide

  // --- ENTRANCE ---
  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.5 },
  });
  const componentScale = interpolate(entranceSpring, [0, 1], [1.4, 1.8]);
  const componentOpacity = interpolate(entranceSpring, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // --- TOGGLE (frame 30) ---
  const TOGGLE_FRAME = 30;
  const toggleEnabled = frame >= TOGGLE_FRAME;
  const toggleSpring = spring({
    frame: frame - TOGGLE_FRAME,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.5 },
  });

  // --- SYNC PROGRESS (45-110) ---
  const SYNC_START = 45;
  const SYNC_END = 110;
  const progress = interpolate(frame, [SYNC_START, SYNC_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const syncStatus: "pending" | "syncing" | "completed" =
    frame < SYNC_START ? "pending" : frame < SYNC_END ? "syncing" : "completed";

  // --- SYNC CARD FADE OUT ---
  const syncFadeOut =
    frame >= 120
      ? interpolate(frame, [120, 135], [1, 0], { extrapolateRight: "clamp" })
      : 1;

  // --- WEEKLY CALENDAR TRANSITION ---
  const CALENDAR_IN = 130;
  const CALENDAR_OUT = 240;
  const calendarEntrance = spring({
    frame: frame - CALENDAR_IN,
    fps,
    config: { damping: 12, mass: 0.5 },
  });
  const calendarScale = interpolate(calendarEntrance, [0, 1], [0.8, 1.6]);
  const calendarOpacity = interpolate(calendarEntrance, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const calendarFadeOut =
    frame >= CALENDAR_OUT
      ? interpolate(frame, [CALENDAR_OUT, 255], [1, 0], {
          extrapolateRight: "clamp",
        })
      : 1;

  // --- END CARD ---
  const END_CARD_START = 250;
  const showEndCard = frame >= END_CARD_START;
  const endCardOpacity = showEndCard
    ? interpolate(frame, [END_CARD_START, END_CARD_START + 10], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0c10" }}>
      <Background type="stars" starsCount={500} />

      {/* Phase 1: OutlookSync toggle + progress */}
      <AbsoluteFill
        style={{
          opacity: componentOpacity * syncFadeOut,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <OutlookSyncComposition
          enabled={toggleEnabled}
          loading={syncStatus === "syncing"}
          showInfo={false}
          progress={progress}
          animate={false}
          toggleProgress={toggleSpring}
          syncStatus={syncStatus}
          eventCount={3}
          scale={componentScale}
          background={undefined}
          rotationX={0}
          rotationY={0}
          depth={0}
          isDone={frame >= SYNC_END}
          showVisualization={frame >= SYNC_START}
        >
          <Sequence>
            <SoundEffect type="SWOOSH" volume={0.5} />
          </Sequence>
          <Sequence from={TOGGLE_FRAME}>
            <SoundEffect type="TOGGLE_ON" volume={0.4} />
          </Sequence>
          <Sequence from={SYNC_END}>
            <SoundEffect type="SUCCESS" volume={0.5} />
          </Sequence>
        </OutlookSyncComposition>
      </AbsoluteFill>

      {/* Phase 2: WeeklyCalendar payoff — Sequence gives lessons local frame 0 */}
      <Sequence from={CALENDAR_IN} layout="none">
        <AbsoluteFill
          style={{
            opacity: calendarOpacity * calendarFadeOut,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WeeklyCalendar scale={calendarScale} hideBackground />
          <SoundEffect type="SWOOSH" volume={0.4} />
        </AbsoluteFill>
      </Sequence>

      {/* Kinetic text overlay */}
      <KineticText
        text="Rozvrh v kalendáři →"
        startFrame={10}
        duration={45}
        fontSize={56}
        top="28%"
      />

      {/* End card */}
      {showEndCard && (
        <AbsoluteFill style={{ opacity: endCardOpacity }}>
          <Sequence from={END_CARD_START} layout="none">
            <BrandedEndSlide
              logoScale={1.0}
              theme="dark"
              animate={true}
              ctaText="Link v biu"
            />
          </Sequence>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
