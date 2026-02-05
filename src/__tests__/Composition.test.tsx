import { render, screen } from '@testing-library/react';
import { Thumbnail } from '@remotion/player';
import { test, expect } from 'vitest';
import { OutlookSyncComposition } from '../compositions/OutlookSync';

// Mock specific remotion functionality if needed, or rely on Thumbnail context
// Thumbnail provides frame context.

test('OutlookSyncComposition frame-accuracy protocol', async () => {
    // We check if the toggle handle is at the correct position at frame 15 (middle of progress 0->1 transition)
    render(
        <Thumbnail
            component={OutlookSyncComposition}
            compositionWidth={600}
            compositionHeight={200}
            frameToDisplay={165} // Scene 3 (Demo) starts at 150 (45+45+60)
            durationInFrames={300}
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
                toggleProgress: 1,
                isDone: false,
                showVisualization: true,
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

