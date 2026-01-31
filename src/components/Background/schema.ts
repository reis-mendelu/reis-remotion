import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const zBackgroundType = z.enum(["solid", "gradient", "mesh", "image", "video", "stars"]);

export const zBackgroundPreset = z.enum([
  "none",
  "mendelu-green",
  "mendelu-dark",
  "pef-blue",
]).default("none");

export const zBackground = z.object({
  type: zBackgroundType.optional(),
  preset: zBackgroundPreset.optional(),
  // For 'solid'
  color: zColor().optional(), 
  // For 'gradient'
  gradientType: z.enum(["linear", "radial"]).optional(),
  gradientColors: z.array(zColor()).optional(),
  gradientAngle: z.number().optional(), // for linear
  // For 'mesh'
  meshColors: z.array(zColor()).optional(),
  // For 'image' | 'video'
  src: z.string().optional(),
  // For 'stars'
  starsCount: z.number().optional(),
});

export type BackgroundProps = z.input<typeof zBackground>;
