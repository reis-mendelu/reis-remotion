import { z } from "zod";

export const ExamRegistrationSchema = z.object({
  scale: z.number().default(2),
  animate: z.boolean().default(true),
});

export type ExamRegistrationProps = z.infer<typeof ExamRegistrationSchema>;
