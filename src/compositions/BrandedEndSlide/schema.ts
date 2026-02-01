import { z } from "zod";

export const BrandedEndSlideSchema = z.object({
  logoScale: z.number().default(1),
  theme: z.enum(["dark", "light"]).default("dark"),
  animate: z.boolean().default(true),
  ctaText: z.string().optional(),
});

export type BrandedEndSlideProps = z.infer<typeof BrandedEndSlideSchema>;
