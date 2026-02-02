# SubjectDrawer Files Hint - Design Research Summary

## User Objective
Research professional design patterns for demonstrating file download/selection in product introduction videos (specifically for SubjectDrawer component). User wanted to understand how Apple, Google, Amazon handle this **without using cursor positioning**.

## Key Design Research Findings

### Industry Standard Patterns

**Universal Pattern**: Green checkmark = "downloaded and available offline" (Google Drive, iCloud, Dropbox, OneDrive all use this)

**Checkbox Selection Pattern** (Material Design standard):
1. User selects files via checkboxes → Visual selection state
2. Download button appears with count ("Download 3 files")
3. User clicks button → Progress indicators show per-file progress
4. Completion → Green checkmarks with celebration animation

### Product Demo Best Practices (from Apple/Google)

**Apple Keynote Techniques**:
- Magic Move for fluid transitions
- Progressive reveal (one interaction at a time)
- Timing: 0.2-0.5s delays between actions
- Success moments **linger 1.5-2 seconds** for comprehension

**For Demos (vs Production)**:
- Animations **slower** (600-800ms vs 200-300ms)
- UI elements **larger** (1.5-2× size)
- **Higher contrast** for visibility
- **No cursor positioning** (focus on UI state changes)

### Animation Timeline Decision

**15 seconds @ 30fps (450 frames)**:
- **Phase 1 (0-5s)**: Selection - checkboxes fill sequentially with brand color
- **Phase 2 (5-6s)**: Download button click animation
- **Phase 3 (6-12s)**: Progress - circular rings show download per file
- **Phase 4 (12-15s)**: Completion - green checkmarks cascade with bounce

### Design Decisions

**Colors** (DaisyUI semantic):
- Brand color (#79be15): Selection state, download button
- Success color (#10b981): Completion state, green checkmarks

**NO CURSOR**: User explicitly requested no cursor positioning to avoid fragile positioning calculations

**Sequential Downloads**: Files download one-by-one (not simultaneously) for clearer demonstration

## Important Note

**WRONG DIRECTORY MISTAKE**: Initial implementation was done in `/root/dev/reis-private/video/` but should be in `/root/dev/reis-remotion/src/`. The correct project already has:
- `SubjectDrawer-FilesHint` composition (line 27 in Root.tsx)
- `FilesHint` component in `compositions/SubjectDrawer/FilesHint`

## For reIS Remotion Agent

The existing `FilesHint` component in `reis-remotion` should implement:

1. **Checkbox States**: empty → selected (brand) → downloading (progress ring) → complete (green checkmark with bounce)
2. **Download Button**: Hidden → Ready ("Download X files") → Downloading (spinner) → Complete ("Downloaded ✓")
3. **No Cursor Animation**: Focus on checkbox/button state changes only
4. **Spring Animations**: Use Remotion spring for organic feel
5. **Sequential Flow**: Visual narrative where one phase completes before next begins

See research doc for detailed animation keyframes and component specs.
