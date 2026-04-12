import { ReelProps } from '../src/schemas/director';

/**
 * A utility to generate a standard reIS Reel JSON.
 * This is what the LLM should eventually be tasked with.
 */
export function generateReelConfig(subject: string, code: string): ReelProps {
  return {
    theme: 'success',
    actions: [
      {
        type: 'intro-title',
        durationInFrames: 60,
        mascotAction: 'wave',
        text: `Jak na ${subject}?`,
        transitionOut: 'fade',
        soundEffect: 'INTRO_SWOOSH',
      },
      {
        type: 'search-bar-demo',
        durationInFrames: 150,
        text: 'Najdi si ho v reISu',
        searchProps: {
          query: subject,
          selectedResultIndex: 0,
        },
        transitionOut: 'fade',
        soundEffect: 'KEYBOARD_CLICK',
      },
      {
        type: 'subject-drawer-demo',
        durationInFrames: 180,
        text: 'Všechny materiály po ruce',
        subjectProps: {
          subjectName: subject,
          subjectCode: code,
          activeTab: 'files',
          selectedFileIndices: [0, 1, 2],
        },
        transitionOut: 'fade',
        soundEffect: 'SUCCESS',
      },
      {
        type: 'end-card',
        durationInFrames: 90,
        text: 'Stahuj na iOS i Android!',
        endCardProps: {
          ctaText: 'reIS University App',
          logoScale: 1.2,
        },
        transitionOut: 'none',
        soundEffect: 'OUTRO_CHIME',
      }
    ]
  };
}

// Example usage
if (require.main === module) {
  const subject = process.argv[2] || 'Statistika';
  const code = process.argv[3] || 'STA';
  console.log(JSON.stringify(generateReelConfig(subject, code), null, 2));
}
