import { render, screen } from '@testing-library/react';
import { Thumbnail } from '@remotion/player';
import { expect, test, describe, vi } from 'vitest';
import { BrandedEndSlide } from '../compositions/BrandedEndSlide';
import { BrandedEndSlideSchema } from '../compositions/BrandedEndSlide/schema';

// Mock useVideoConfig to prevent NaN errors in tests
vi.mock("remotion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("remotion")>();
  return {
    ...actual,
    useVideoConfig: () => ({
      width: 1920,
      height: 1080,
      fps: 30,
      durationInFrames: 150,
    }),
  };
});

describe('BrandedEndSlide', () => {
    test('It adheres to the Munger Stupidity Filter (Schema Validation)', () => {
        const validProps = { theme: "dark", logoScale: 1.5 };
        expect(BrandedEndSlideSchema.parse(validProps)).toEqual({
            theme: "dark",
            logoScale: 1.5,
            animate: true // Default
        });

        const invalidProps = { theme: "invalid" };
        expect(() => BrandedEndSlideSchema.parse(invalidProps)).toThrow();
    });

    test('It renders the logo image correctly', async () => {
        const props = BrandedEndSlideSchema.parse({
            theme: "dark",
            logoScale: 1.5,
        });

        render(
            <Thumbnail
                component={BrandedEndSlide}
                frameToDisplay={30}
                durationInFrames={150}
                fps={30}
                width={1920}
                height={1080}
                inputProps={props}
            />
        );

        const logo = await screen.findByAltText(/Mendelova Univerzita Logo/i);
        expect(logo).toBeDefined();
        expect(logo.getAttribute('src')).toContain('mendelu_logo.png');
    });
});
