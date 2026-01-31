import { render, screen } from '@testing-library/react';
import { Thumbnail } from '@remotion/player';
import { ProfessionalText } from '../ProfessionalText';
import { describe, it, expect } from 'vitest';

describe('ProfessionalText', () => {
  it('renders text characters', async () => {
    render(
      <Thumbnail
        component={ProfessionalText}
        compositionWidth={1280}
        compositionHeight={720}
        frameToDisplay={60}
        durationInFrames={120}
        fps={30}
        inputProps={{
          text: "Test",
          type: "headline",
          animate: false,
        }}
      />
    );
    // In typewriter mode, each character is a span. We check for the presence of the characters.
    const charT = await screen.findByText('T');
    const charE = await screen.findByText('e');
    const charS = await screen.findByText('s');
    const charT2 = await screen.findByText('t');
    expect(charT).toBeTruthy();
    expect(charE).toBeTruthy();
    expect(charS).toBeTruthy();
    expect(charT2).toBeTruthy();
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
    const element = await screen.findByText('H');
    expect(element.parentElement?.style.fontSize).toBe('80px');
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
          text: "reIS",
          type: "hook",
          animate: false,
        }}
      />
    );
    const element = await screen.findByText('r');
    expect(element.parentElement?.style.fontSize).toBe('120px');
  });

  it('renders highlighted words with branding color', async () => {
    render(
      <Thumbnail
        component={ProfessionalText}
        compositionWidth={1280}
        compositionHeight={720}
        frameToDisplay={30}
        durationInFrames={60}
        fps={30}
        inputProps={{
          text: "*Highlight*",
          type: "headline",
          highlightColor: "#79be15",
          animate: false,
        }}
      />
    );
    const element = await screen.findByText('H');
    expect(element.style.color).toBe('rgb(121, 190, 21)'); // Hex #79be15 in RGB
  });
});
