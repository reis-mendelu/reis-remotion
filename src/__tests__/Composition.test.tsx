import { render, screen, waitFor } from '@testing-library/react';
import { Thumbnail } from '@remotion/player';
import { MyComposition } from '../Composition';
import React from 'react';

// Mock specific remotion functionality if needed, or rely on Thumbnail context
// Thumbnail provides frame context.

test('MyComposition renders title efficiently', async () => {
    const testTitle = "Integration Test Title";
    
    render(
        <Thumbnail
            component={MyComposition}
            compositionWidth={1280}
            compositionHeight={720}
            frameToDisplay={30}
            durationInFrames={60}
            fps={30}
            inputProps={{
                title: testTitle,
                logoColor: "#ff0000"
            }}
        />
    );

    // Using findByText as it's async and waits for potential suspension updates
    const titleElement = await screen.findByText(testTitle);
    expect(titleElement).toBeTruthy();
    expect(titleElement.className).toContain('text-8xl');
});
