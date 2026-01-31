import React from "react";
import { Audio } from "remotion";
import { AudioKey, getAudioSrc } from "../audio/AudioMap";

interface SoundEffectProps {
  type: AudioKey;
  volume?: number;
  startFrom?: number;
  endAt?: number;
}

/**
 * A "Stupidity Filter" wrapper for Remotion Audio.
 * Ensures we only use valid keys from our AudioMap.
 */
export const SoundEffect: React.FC<SoundEffectProps> = ({
  type,
  volume = 0.5,
  startFrom,
  endAt,
}) => {
  const src = getAudioSrc(type);

  return (
    <Audio
      src={src}
      volume={volume}
      startFrom={startFrom}
      endAt={endAt}
    />
  );
};
