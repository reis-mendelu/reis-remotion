import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { Background } from "../../components/Background";
import { MendeluEnvironment } from "../../Environment";
import { SoundEffect } from "../../components/SoundEffect";
import { SearchBarStatic } from "../../components/SearchBar/SearchBarStatic";
import type { SearchBarProps } from "./schema";

// Timeline constants (frames @ 30fps)
const TYPE_START = 30;
const TYPE_END = 120;
const LOADING_START = 120;
const RESULTS_START = 140;
const RESULTS_END = 190;
const NAVIGATE_START = 190;
const NAVIGATE_END = 215;
const SELECT_START = 215;

export const SearchBarComposition: React.FC<SearchBarProps & { children?: React.ReactNode }> = (props) => {
  const { query, results, selectedResultIndex, background, scale = 1 } = props;
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Phase 1: Entrance (0-30)
  const entrance = spring({ frame, fps, config: { damping: 20 } });
  const entranceOpacity = interpolate(entrance, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const entranceScale = interpolate(entrance, [0, 1], [0.95, 1], { extrapolateRight: "clamp" });

  // Phase 2: Typewriter (30-120)
  const totalChars = query.length;
  const charsVisible = frame < TYPE_START ? 0 :
    Math.min(totalChars, Math.floor(interpolate(frame, [TYPE_START, TYPE_END], [0, totalChars], { extrapolateRight: "clamp" })));
  const queryText = query.slice(0, charsVisible);

  // Cursor blink (every 15 frames)
  const cursorOpacity = frame >= TYPE_START && frame < RESULTS_END
    ? (Math.floor(frame / 15) % 2 === 0 ? 1 : 0)
    : 0;

  // Phase 3: Loading (120-140)
  const isLoading = frame >= LOADING_START && frame < RESULTS_START;

  // Phase 4: Results staggered entrance (140-190)
  const isOpen = frame >= LOADING_START;
  const visibleResults = frame < RESULTS_START ? [] :
    results.filter((_, i) => frame >= RESULTS_START + i * 5);

  // Phase 5: Navigation (190-215)
  let currentSelectedIndex = -1;
  if (frame >= NAVIGATE_START) {
    const navigateProgress = Math.min(
      selectedResultIndex,
      Math.floor(interpolate(frame, [NAVIGATE_START, NAVIGATE_END], [0, selectedResultIndex], { extrapolateRight: "clamp" }))
    );
    currentSelectedIndex = navigateProgress;
  }

  // Phase 6: Select pulse (215+)
  const selectPulse = frame >= SELECT_START
    ? spring({ frame: frame - SELECT_START, fps, config: { damping: 10, mass: 0.3 } })
    : 0;
  // selectPulse can be used for future visual effects on the selected item
  void selectPulse;

  return (
    <AbsoluteFill className="overflow-hidden">
      {background && <Background {...background} />}

      <Sequence from={TYPE_START}>
        <SoundEffect type="TOGGLE_ON" volume={0.3} />
      </Sequence>

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
            transform: `scale(${scale * entranceScale})`,
            width: "700px",
          }}
        >
          <SearchBarStatic
            queryText={queryText}
            isOpen={isOpen}
            isLoading={isLoading}
            results={visibleResults}
            selectedIndex={currentSelectedIndex}
            showClear={charsVisible > 0}
            showCursor={frame >= TYPE_START && frame < RESULTS_END}
            cursorOpacity={cursorOpacity}
          />
        </div>
      </MendeluEnvironment>
    </AbsoluteFill>
  );
};
