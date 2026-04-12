import { ReelProps } from '../src/schemas/director';

/**
 * A utility to generate a standard reIS Reel JSON.
 */
export function generateReelConfig(subject: string, code: string): ReelProps {
  return {
    theme: 'success',
    actions: [
      {
        type: 'intro-title',
        durationInFrames: 60,
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
          results: [
            { id: "1", title: subject, type: "subject", detail: `${code} · PEF`, subjectCode: code },
          ]
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
          files: [
            { file_name: "Přednášky", link: "p1" },
            { file_name: "Cvičení", link: "c1" },
            { file_name: "Zkouškové okruhy", link: "z1" },
          ]
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

if (require.main === module) {
  const subject = process.argv[2] || 'Statistika';
  const code = process.argv[3] || 'STA';
  console.log(JSON.stringify(generateReelConfig(subject, code), null, 2));
}
