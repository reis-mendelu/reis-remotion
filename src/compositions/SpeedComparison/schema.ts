import { z } from "zod";

export const SpeedComparisonSchema = z.object({
  isVideoSrc: z.string().default("is soubor.mov"),
  reisVideoSrc: z.string().default("reIS soubor.mov"),
  isVideoDurationFrames: z.number().default(1180),
  reisVideoDurationFrames: z.number().default(236),
  isGraceFrames: z.number().default(120), // frames IS stays visible after reIS finishes
  title: z.string().default("Stažení souboru ze cvik"),
  isLabel: z.string().default("IS"),
  reisLabel: z.string().default("reIS"),
  accentColor: z.string().default("#79BE15"),
});

export type SpeedComparisonProps = z.infer<typeof SpeedComparisonSchema>;
