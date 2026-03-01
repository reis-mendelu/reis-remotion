import { z } from "zod";
import { zBackground } from "../../components/Background/schema";

const SearchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(["person", "page", "subject"]),
  detail: z.string().optional(),
  personType: z.enum(["student", "teacher", "staff", "unknown"]).optional(),
  subjectCode: z.string().optional(),
});

export const SearchBarSchema = z.object({
  query: z.string().default("podnikova ekonomi"),
  results: z.array(SearchResultSchema).default([
    { id: "1", title: "Podniková ekonomika", type: "subject", detail: "D-PODEK · ZF", subjectCode: "D-PODEK" },
    { id: "2", title: "Podniková ekonomika", type: "subject", detail: "EKO · ZS 2025/2026 · AF", subjectCode: "EKO" },
    { id: "3", title: "Podniková ekonomika", type: "subject", detail: "RRPEK · LS 2025/2026 · FRRMS", subjectCode: "RRPEK" },
    { id: "4", title: "Podniková ekonomika", type: "subject", detail: "EKO · LS 2025/2026 · AF", subjectCode: "EKO" },
    { id: "5", title: "Podniková ekonomika (FT)", type: "subject", detail: "POEKF · LS 2025/2026 · ZF", subjectCode: "POEKF" },
    { id: "6", title: "Podniková ekonomika (RSZ)", type: "subject", detail: "POEKR · ZS 2025/2026 · ZF", subjectCode: "POEKR" },
    { id: "7", title: "Podniková ekonomika (ZI)", type: "subject", detail: "PODEK · ZS 2025/2026 · ZF", subjectCode: "PODEK" },
    { id: "8", title: "Podniková ekonomika 1", type: "subject", detail: "EBC-PE · ZS 2025/2026 · PEF", subjectCode: "EBC-PE" },
    { id: "9", title: "Podniková ekonomika 1", type: "subject", detail: "EBC-PE · LS 2025/2026 · PEF", subjectCode: "EBC-PE" },
  ]),
  selectedResultIndex: z.number().default(7),
  background: zBackground.optional(),
  scale: z.number().default(1),
});

export type SearchBarProps = z.infer<typeof SearchBarSchema>;
export type SearchResultItem = z.infer<typeof SearchResultSchema>;
