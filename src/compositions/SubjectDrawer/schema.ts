import { z } from "zod";
import { zBackground } from "../../components/Background/schema";

export const FileSchema = z.object({
  file_name: z.string(),
  link: z.string(),
  file_comment: z.string().optional(),
});

export const FileGroupSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  files: z.array(FileSchema),
});

export const TeacherSchema = z.object({
  name: z.string(),
  roles: z.string().optional(),
});

export const SubjectSchema = z.object({
  name: z.string().min(1, "Subject name cannot be empty"),
  code: z.string(),
  credits: z.string(),
  status: z.string(),
  completion: z.string(),
  garant: z.string().optional(),
  vyucujici: z.array(TeacherSchema).optional(),
});

export const SyllabusSchema = z.object({
  requirementsText: z.string().optional(),
  requirementsTable: z.array(z.object({
    id: z.string(),
    label: z.string(),
    points: z.string(),
  })).optional(),
});

export const SuccessRateSchema = z.object({
  stats: z.array(z.object({
    semester: z.string(),
    totalPass: z.number(),
    totalFail: z.number(),
    type: z.enum(["credit", "exam"]),
    terms: z.array(z.object({
      grades: z.record(z.string(), z.number()).optional(),
      creditGrades: z.object({
        zap: z.number(),
        nezap: z.number(),
        zapNedost: z.number().optional(),
      }).optional(),
    })),
  })),
});

export const SubjectDrawerSchema = z.object({
  subject: SubjectSchema,
  groups: z.array(FileGroupSchema).default([]),
  syllabus: SyllabusSchema.optional(),
  successRate: SuccessRateSchema.optional(),
  activeTab: z.enum(["files", "syllabus", "stats"]).default("files"),
  progress: z.number().min(0).max(1).default(1),
  animate: z.boolean().default(false),
  background: zBackground.optional(),
  scale: z.number().default(1),
  selectedIds: z.array(z.string()).default([]),
  downloadedIds: z.array(z.string()).default([]),
  downloadProgress: z.record(z.string(), z.number().min(0).max(1)).optional(),
  buttonState: z.enum(['hidden', 'ready', 'clicking', 'downloading', 'complete']).optional(),
  rotationX: z.number().default(0),
  rotationY: z.number().default(0),
  depth: z.number().default(0),
  scriptedSelection: z.boolean().optional(),
  isDone: z.boolean().optional(),
});

export type File = z.infer<typeof FileSchema>;
export type FileGroup = z.infer<typeof FileGroupSchema>;
export type Teacher = z.infer<typeof TeacherSchema>;
export type Subject = z.infer<typeof SubjectSchema>;
export type SubjectDrawerProps = z.input<typeof SubjectDrawerSchema>;
export type SubjectDrawerOutput = z.infer<typeof SubjectDrawerSchema>;
