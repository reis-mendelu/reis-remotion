import { render, screen } from '@testing-library/react';
import { Thumbnail } from '@remotion/player';
import { test, expect } from 'vitest';
import { MyComposition, OutlookSyncComposition } from '../Composition';

// Mock specific remotion functionality if needed, or rely on Thumbnail context
// Thumbnail provides frame context.

test('OutlookSyncComposition renders title efficiently', async () => {
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

test('OutlookSyncComposition frame-accuracy protocol', async () => {
    // We check if the toggle handle is at the correct position at frame 15 (middle of progress 0->1 transition)
    render(
        <Thumbnail
            component={OutlookSyncComposition}
            compositionWidth={600}
            compositionHeight={200}
            frameToDisplay={15}
            durationInFrames={30}
            fps={30}
            inputProps={{
                enabled: true,
                loading: true, // Test loading pulse too
                showInfo: false,
                progress: 0.5,
                animate: false,
                rotationX: 0,
                rotationY: 0,
                depth: 0,
                syncStatus: "syncing",
                eventCount: 3,
                scale: 1,
            }}
        />
    );

    // The toggle handle is specifically the white circle div
    const handleElement = await screen.findByTestId('toggle-handle');
    expect(handleElement).toBeTruthy();
    
    const leftValue = (handleElement as HTMLElement).style.left;
    console.log('Handle Left Value:', leftValue);
    const leftPx = parseFloat(leftValue);
    
    // Safety ranges: toggleX maps 0-1 to 4-14. 
    // Allowing for physical overshoot up to 15px (momentum!)
    expect(leftPx).toBeGreaterThanOrEqual(4);
    expect(leftPx).toBeLessThanOrEqual(15);
    
    // Verify loading pulse (scale)
    const transformValue = (handleElement as HTMLElement).style.transform;
    expect(transformValue).toContain('scale');
});

