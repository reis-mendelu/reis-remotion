import { staticFile } from "remotion";
import { z } from "zod";

export const AudioKeySchema = z.enum(["TOGGLE_ON", "TOGGLE_OFF", "HOVER", "SWOOSH", "SUCCESS", "TICK", "INTRO_SWOOSH", "OUTRO_CHIME"]);

export type AudioKey = z.infer<typeof AudioKeySchema>;

export const AUDIO_ASSETS: Record<AudioKey, string> = {
  TOGGLE_ON: staticFile("kenney_ui-audio/Audio/click1.ogg"),
  TOGGLE_OFF: staticFile("kenney_ui-audio/Audio/switch2.ogg"),
  HOVER: staticFile("kenney_ui-audio/Audio/rollover3.ogg"),
  SWOOSH: staticFile("kenney_ui-audio/Audio/switch1.ogg"), // Louder entrance sound
  SUCCESS: staticFile("kenney_ui-audio/Audio/switch10.ogg"),
  TICK: staticFile("kenney_ui-audio/Audio/click1.ogg"),
  INTRO_SWOOSH: staticFile("kenney_ui-audio/Audio/switch1.ogg"),
  OUTRO_CHIME: staticFile("kenney_ui-audio/Audio/switch10.ogg"),
};

export const getAudioSrc = (key: AudioKey): string => {
  const asset = AUDIO_ASSETS[key];
  if (!asset) {
      throw new Error(`Audio asset not found for key: ${key}`);
  }
  return asset;
};
