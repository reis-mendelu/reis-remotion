import { z } from 'zod';
import { AudioKeySchema } from '../audio/AudioMap';

export const FileSchema = z.object({
  file_name: z.string(),
  link: z.string(),
});

export const SuccessRateStatSchema = z.object({
  semester: z.string(),
  totalPass: z.number(),
  totalFail: z.number(),
  type: z.enum(['exam', 'credit']),
  terms: z.array(z.object({
    grades: z.record(z.string(), z.number()),
  })),
});

export const ActionSchema = z.object({
  type: z.enum([
    'intro-title', 
    'data-showcase', 
    'subject-drawer-demo',
    'outlook-sync-demo',
    'calendar-showcase',
    'search-bar-demo',
    'subject-stats-demo',
    'end-card'
  ]),
  durationInFrames: z.number().min(30).max(600),
  text: z.string().max(100).optional(),
  transitionOut: z.enum(['fade', 'wipe-left', 'none']),
  
  // Audio
  soundEffect: AudioKeySchema.optional(),
  
  // Specific props for subject-drawer-demo & subject-stats-demo
  subjectProps: z.object({
    subjectName: z.string(),
    subjectCode: z.string(),
    activeTab: z.enum(['info', 'files', 'syllabus', 'classmates', 'stats']).default('files'),
    selectedFileIndices: z.array(z.number()).optional(),
    files: z.array(FileSchema).optional(),
    successRate: z.object({
      stats: z.array(SuccessRateStatSchema),
    }).optional(),
  }).optional(),

  // Specific props for search-bar-demo
  searchProps: z.object({
    query: z.string(),
    selectedResultIndex: z.number().default(0),
    results: z.array(z.object({
      id: z.string(),
      title: z.string(),
      type: z.string(),
      detail: z.string(),
      subjectCode: z.string(),
    })).optional(),
  }).optional(),

  // Specific props for end-card
  endCardProps: z.object({
    ctaText: z.string().default('Link v biu'),
    logoScale: z.number().default(1.5),
  }).optional(),
});

export const ReelSchema = z.object({
  theme: z.enum(['success', 'warning', 'info', 'dark']),
  actions: z.array(ActionSchema),
  backgroundMusic: z.string().optional(),
});

export type ReelProps = z.infer<typeof ReelSchema>;
export type ActionProps = z.infer<typeof ActionSchema>;
