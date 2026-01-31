import { render, screen } from '@testing-library/react';
import { Thumbnail } from '@remotion/player';
import { ProfessionalText } from '../ProfessionalText';
import { describe, it, expect } from 'vitest';

describe('ProfessionalText', () => {
  it('renders the correct text content', async () => {
    render(
      <Thumbnail
        component={ProfessionalText}
        compositionWidth={1280}
        compositionHeight={720}
        frameToDisplay={30}
        durationInFrames={60}
        fps={30}
        inputProps={{
          text: "Test Text",
          type: "headline",
          animate: false,
        }}
      />
    );
    const element = await screen.findByText('Test Text');
    expect(element).toBeTruthy();
  });

  it('applies the correct font size for headline preset', async () => {
    render(
      <Thumbnail
        component={ProfessionalText}
        compositionWidth={1280}
        compositionHeight={720}
        frameToDisplay={30}
        durationInFrames={60}
        fps={30}
        inputProps={{
          text: "Headline",
          type: "headline",
          animate: false,
        }}
      />
    );
    const element = await screen.findByText('Headline');
    expect(element.style.fontSize).toBe('48px');
  });

  it('applies the correct font size for hook preset', async () => {
    render(
      <Thumbnail
        component={ProfessionalText}
        compositionWidth={1280}
        compositionHeight={720}
        frameToDisplay={30}
        durationInFrames={60}
        fps={30}
        inputProps={{
          text: "Hook",
          type: "hook",
          animate: false,
        }}
      />
    );
    const element = await screen.findByText('Hook');
    expect(element.style.fontSize).toBe('64px');
  });

  it('enables subpixel anti-aliasing via background color', async () => {
    render(
      <Thumbnail
        component={ProfessionalText}
        compositionWidth={1280}
        compositionHeight={720}
        frameToDisplay={30}
        durationInFrames={60}
        fps={30}
        inputProps={{
          text: "AA Test",
          type: "body",
          animate: false,
        }}
      />
    );
    const element = await screen.findByText('AA Test');
    expect(element.style.backgroundColor).toBe('rgba(0, 0, 0, 0.25)');
  });
});
