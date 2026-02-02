import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const professionalTextSchema = z.object({
  text: z.string(),
  type: z.enum(["hook", "context", "headline", "body", "problem", "question", "cta", "subtext"]),
  mode: z.enum(["word", "typewriter", "reveal", "minimalist", "refined", "whisper"]).optional(),
  color: zColor().optional(),
  highlightColor: zColor().optional(),
  animate: z.boolean().optional(),
  stagger: z.number().optional(),
  padding: z.string().optional(),
});

export type ProfessionalTextProps = z.infer<typeof professionalTextSchema>;
