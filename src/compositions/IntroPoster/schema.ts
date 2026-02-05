import { z } from "zod";

export const IntroPosterSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  showGuides: z.boolean().default(false),
});
