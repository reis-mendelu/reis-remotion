import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const professionalTextSchema = z.object({
  text: z.string(),
  type: z.enum(["hook", "context", "headline", "body"]),
  mode: z.enum(["word", "typewriter", "reveal", "minimalist"]).optional(),
  color: zColor().optional(),
  highlightColor: zColor().optional(),
  animate: z.boolean().optional(),
  stagger: z.number().optional(),
});

export type ProfessionalTextProps = z.infer<typeof professionalTextSchema>;
