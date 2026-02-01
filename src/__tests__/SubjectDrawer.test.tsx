import { render, screen } from '@testing-library/react';
import { Thumbnail } from '@remotion/player';
import { expect, test, describe } from 'vitest';
import { SubjectDrawerComposition } from '../compositions/SubjectDrawer';
import { SubjectDrawerSchema } from '../compositions/SubjectDrawer/schema';

const mockSubject = {
  name: "Algoritmy a datové struktury",
  code: "ADS",
  credits: "6 KREDITŮ",
  status: "POVINNÝ",
  completion: "Zkouška",
};

// Mock useVideoConfig to prevent NaN errors in tests
vi.mock("remotion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("remotion")>();
  return {
    ...actual,
    useVideoConfig: () => ({
      width: 1920,
      height: 1080,
      fps: 30,
      durationInFrames: 60,
    }),
  };
});

describe('SubjectDrawer', () => {
    test('It throws error when provided with invalid subject data (Munger Stupidity Filter)', () => {
        const invalidProps = {
            subject: { name: "" }, // Violates min(1)
            activeTab: "files"
        };
        expect(() => SubjectDrawerSchema.parse(invalidProps)).toThrow();
    });

    test('It renders the Files tab correctly at frame 30', async () => {
        const props = SubjectDrawerSchema.parse({
            subject: mockSubject,
            groups: [
                {
                    name: "lektury",
                    displayName: "Přednášky",
                    files: [{ file_name: "test.pdf", link: "l1", file_comment: "comment" }]
                }
            ],
            activeTab: "files"
        });

        render(
            <Thumbnail
                component={SubjectDrawerComposition}
                frameToDisplay={30}
                durationInFrames={60}
                fps={30}
                width={600}
                height={800}
                inputProps={props}
            />
        );

        const fileName = await screen.findByText(/test.pdf/i);
        expect(fileName).toBeDefined();
        
        const groupHeader = await screen.findByText(/Přednášky/i);
        expect(groupHeader).toBeDefined();
    });

    test('It renders the Syllabus tab correctly', async () => {
        const props = SubjectDrawerSchema.parse({
            subject: mockSubject,
            activeTab: "syllabus",
            syllabus: {
                requirementsText: "Test Requirements"
            }
        });

        render(
            <Thumbnail
                component={SubjectDrawerComposition}
                frameToDisplay={30}
                durationInFrames={60}
                fps={30}
                width={600}
                height={800}
                inputProps={props}
            />
        );

        const reqText = await screen.findByText(/Test Requirements/i);
        expect(reqText).toBeDefined();
    });

    test('It renders the SuccessRate tab correctly', async () => {
        const props = SubjectDrawerSchema.parse({
            subject: mockSubject,
            activeTab: "stats",
            successRate: {
                stats: [{
                    semester: "Zima 2024",
                    totalPass: 10,
                    totalFail: 5,
                    type: "exam",
                    terms: [{ grades: { "A": 10 } }]
                }]
            }
        });

        render(
            <Thumbnail
                component={SubjectDrawerComposition}
                frameToDisplay={30}
                durationInFrames={60}
                fps={30}
                width={600}
                height={800}
                inputProps={props}
            />
        );

        const totalStudents = await screen.findByText(/15/i);
        expect(totalStudents).toBeDefined();
        
        const semester = await screen.findByText(/Zima 2024/i);
        expect(semester).toBeDefined();
    });
});
