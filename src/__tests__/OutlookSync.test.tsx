import { render, screen } from '@testing-library/react';
import { Thumbnail } from '@remotion/player';
import { expect, test } from 'vitest';
import { OutlookSyncComposition } from '../Composition';

test('OutlookSyncComposition renders correctly at different frames', async () => {
  const { rerender } = render(
    <Thumbnail
      component={OutlookSyncComposition}
      compositionWidth={1280}
      compositionHeight={720}
      frameToDisplay={0}
      durationInFrames={30}
      fps={30}
      inputProps={{
        enabled: true,
        loading: false,
        animate: true,
      }}
    />
  );

  // Check initial state (frame 0)
  // toggleX should be 4 at progress 0
  let toggleHandle = document.querySelector('[style*="left: 4px"]');
  expect(toggleHandle).toBeTruthy();

  // Rerender at final frame (29)
  rerender(
    <Thumbnail
      component={OutlookSyncComposition}
      compositionWidth={1280}
      compositionHeight={720}
      frameToDisplay={29}
      durationInFrames={30}
      fps={30}
      inputProps={{
        enabled: true,
        loading: false,
        animate: true,
      }}
    />
  );

  // At final frame, progress is 1, toggleX should be 14
  toggleHandle = document.querySelector('[style*="left: 14px"]');
  expect(toggleHandle).toBeTruthy();
});

test('OutlookSyncComposition handles static progress', async () => {
  render(
    <Thumbnail
      component={OutlookSyncComposition}
      compositionWidth={1280}
      compositionHeight={720}
      frameToDisplay={0}
      durationInFrames={30}
      fps={30}
      inputProps={{
        enabled: true,
        loading: false,
        progress: 0.5,
        animate: false,
      }}
    />
  );

  // At progress 0.5, toggleX should be 9 (interpolate(0.5, [0,1], [4,14]))
  const toggleHandle = document.querySelector('[style*="left: 9px"]');
  expect(toggleHandle).toBeTruthy();
});
