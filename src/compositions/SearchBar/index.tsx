import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { Background } from "../../components/Background";
import { MendeluEnvironment } from "../../Environment";
import { SoundEffect } from "../../components/SoundEffect";
import { SearchBarStatic } from "../../components/SearchBar/SearchBarStatic";
import type { SearchBarProps } from "./schema";

// Timeline constants (frames @ 30fps)
const TYPE_START = 30;
const DROPDOWN_START = 95;  // dropdown begins sliding open
const NAVIGATE_START = 145; // pause before navigating
const NAVIGATE_END = 220;   // ~2.5s to scroll through 5 items (~15f per step)
const SELECT_START = 235;   // pause after landing on target

const MAX_VISIBLE_RESULTS = 5;
const FRAMES_PER_KEYSTROKE = 3;

export const SearchBarComposition: React.FC<SearchBarProps & { children?: React.ReactNode }> = (props) => {
  const { query, results, selectedResultIndex, background, scale = 1 } = props;
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const cappedResults = results.slice(0, MAX_VISIBLE_RESULTS);
  const cappedSelectedIndex = Math.min(selectedResultIndex, cappedResults.length - 1);

  // Phase 1: Entrance (0-30)
  const entrance = spring({ frame, fps, config: { damping: 20 } });
  const entranceOpacity = interpolate(entrance, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const entranceScale = interpolate(entrance, [0, 1], [0.95, 1], { extrapolateRight: "clamp" });

  // Phase 2: Typewriter (30+) — discrete steps
  const totalChars = query.length;
  const charsVisible = frame < TYPE_START ? 0 :
    Math.min(totalChars, Math.floor((frame - TYPE_START) / FRAMES_PER_KEYSTROKE));
  const queryText = query.slice(0, charsVisible);

  // Cursor blink (every 15 frames)
  const cursorOpacity = frame >= TYPE_START && frame < NAVIGATE_START
    ? (Math.floor(frame / 15) % 2 === 0 ? 1 : 0)
    : 0;

  // Phase 3: Dropdown slide-down (95+) — spring-based height reveal, no loading state
  const isOpen = frame >= DROPDOWN_START;
  const dropdownProgress = frame >= DROPDOWN_START
    ? spring({ frame: frame - DROPDOWN_START, fps, config: { damping: 15, mass: 0.4 } })
    : 0;

  // Phase 4: Navigation (145-220) — deliberate scrolling
  let currentSelectedIndex = -1;
  if (frame >= NAVIGATE_START && cappedSelectedIndex > 0) {
    const framesPerStep = Math.floor((NAVIGATE_END - NAVIGATE_START) / cappedSelectedIndex);
    const stepIndex = Math.floor((frame - NAVIGATE_START) / framesPerStep);
    currentSelectedIndex = Math.min(stepIndex, cappedSelectedIndex);
  }

  // Phase 5: Select pulse (235+)
  const selectPulse = frame >= SELECT_START
    ? spring({ frame: frame - SELECT_START, fps, config: { damping: 10, mass: 0.3 } })
    : 0;
  void selectPulse;

  // Tick sounds during navigation (one per step)
  const navSoundFrames: number[] = [];
  if (cappedSelectedIndex > 0) {
    const framesPerStep = Math.floor((NAVIGATE_END - NAVIGATE_START) / cappedSelectedIndex);
    for (let i = 0; i <= cappedSelectedIndex; i++) {
      navSoundFrames.push(NAVIGATE_START + i * framesPerStep);
    }
  }

  return (
    <AbsoluteFill className="overflow-hidden">
      {background && <Background {...background} />}

      {/* Tick sounds during navigation */}
      {navSoundFrames.map((f) => (
        <Sequence key={`nav-${f}`} from={f} durationInFrames={5}>
          <SoundEffect type="TICK" volume={0.25} />
        </Sequence>
      ))}

      {/* Select sound */}
      <Sequence from={SELECT_START}>
        <SoundEffect type="SWOOSH" volume={0.5} />
      </Sequence>

      <MendeluEnvironment
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: "transparent" }}
      >
        <div
          style={{
            opacity: entranceOpacity,
            transform: `scale(${entranceScale})`,
            width: `${380 * scale}px`,
          }}
        >
          <SearchBarStatic
            queryText={queryText}
            isOpen={isOpen}
            isLoading={false}
            results={cappedResults}
            selectedIndex={currentSelectedIndex}
            showClear={charsVisible > 0}
            showCursor={frame >= TYPE_START && frame < NAVIGATE_START}
            cursorOpacity={cursorOpacity}
            dropdownProgress={dropdownProgress}
          />
        </div>
      </MendeluEnvironment>
    </AbsoluteFill>
  );
};
