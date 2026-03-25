import { z } from "zod";

export const DiningTableSchema = z.object({
  scale: z.number().optional(),
  animate: z.boolean().optional(),
  date: z.number(), // day of month, e.g. 26
  dayName: z.string(), // e.g. "Čtvrtek"
  activeTab: z.enum(["X", "KA", "JAK"]).optional(),
  menus: z.object({
    X: z.array(z.string()),
    KA: z.array(z.string()),
    JAK: z.array(z.string()),
  }),
});

export type DiningTableProps = z.infer<typeof DiningTableSchema>;
