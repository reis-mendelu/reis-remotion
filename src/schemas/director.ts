import { z } from 'zod';
import { AudioKeySchema } from '../audio/AudioMap';

export const ActionSchema = z.object({
  type: z.enum([
    'intro-title', 
    'mascot-explainer', 
    'data-showcase', 
    'subject-drawer-demo',
    'outlook-sync-demo',
    'calendar-showcase',
    'search-bar-demo',
    'subject-stats-demo',
    'end-card'
  ]),
  durationInFrames: z.number().min(30).max(600),
  mascotAction: z.enum(['idle', 'wave', 'point-right', 'point-left', 'celebrate']).optional(),
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
  }).optional(),

  // Specific props for search-bar-demo
  searchProps: z.object({
    query: z.string(),
    selectedResultIndex: z.number().default(0),
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
  backgroundMusic: z.string().optional(), // path to an ogg/mp3 file in public/
});

export type ReelProps = z.infer<typeof ReelSchema>;
export type ActionProps = z.infer<typeof ActionSchema>;
