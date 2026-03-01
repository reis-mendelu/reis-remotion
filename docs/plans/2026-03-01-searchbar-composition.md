# SearchBar Composition Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a Building Block Remotion composition that demos the SearchBar with a typewriter search for "podnikova ekonomi", showing real results and selecting the PEF one.

**Architecture:** Build a frame-driven "dumb" clone of the extension's SearchBar that accepts all state as props (query text, results, selected index, loading, open). The composition wrapper drives these props from `useCurrentFrame()`. The JSX/CSS must be 1:1 identical to the extension's `SearchBar/index.tsx`, `SearchResultItem.tsx`, and `SearchFooter.tsx`.

**Tech Stack:** Remotion 4.0, React, Zod, Tailwind/DaisyUI, lucide-react

---

### Task 1: Create the SearchBar Zod Schema

**Files:**
- Create: `src/compositions/SearchBar/schema.ts`

**Step 1: Write schema file**

```typescript
import { z } from "zod";
import { zBackground } from "../../components/Background/schema";

const SearchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(["person", "page", "subject"]),
  detail: z.string().optional(),
  personType: z.enum(["student", "teacher", "staff", "unknown"]).optional(),
  subjectCode: z.string().optional(),
});

export const SearchBarSchema = z.object({
  query: z.string().default("podnikova ekonomi"),
  results: z.array(SearchResultSchema).default([
    { id: "1", title: "Podniková ekonomika", type: "subject", detail: "D-PODEK · ZF", subjectCode: "D-PODEK" },
    { id: "2", title: "Podniková ekonomika", type: "subject", detail: "EKO · ZS 2025/2026 · AF", subjectCode: "EKO" },
    { id: "3", title: "Podniková ekonomika", type: "subject", detail: "RRPEK · LS 2025/2026 · FRRMS", subjectCode: "RRPEK" },
    { id: "4", title: "Podniková ekonomika", type: "subject", detail: "EKO · LS 2025/2026 · AF", subjectCode: "EKO" },
    { id: "5", title: "Podniková ekonomika (FT)", type: "subject", detail: "POEKF · LS 2025/2026 · ZF", subjectCode: "POEKF" },
    { id: "6", title: "Podniková ekonomika (RSZ)", type: "subject", detail: "POEKR · ZS 2025/2026 · ZF", subjectCode: "POEKR" },
    { id: "7", title: "Podniková ekonomika (ZI)", type: "subject", detail: "PODEK · ZS 2025/2026 · ZF", subjectCode: "PODEK" },
    { id: "8", title: "Podniková ekonomika 1", type: "subject", detail: "EBC-PE · ZS 2025/2026 · PEF", subjectCode: "EBC-PE" },
    { id: "9", title: "Podniková ekonomika 1", type: "subject", detail: "EBC-PE · LS 2025/2026 · PEF", subjectCode: "EBC-PE" },
  ]),
  selectedResultIndex: z.number().default(7),
  background: zBackground.optional(),
  scale: z.number().default(1),
});

export type SearchBarProps = z.infer<typeof SearchBarSchema>;
export type SearchResultItem = z.infer<typeof SearchResultSchema>;
```

**Step 2: Verify TypeScript compiles**

Run: `cd /root/reis-dev/reis-remotion && npx tsc --noEmit src/compositions/SearchBar/schema.ts 2>&1 | head -20`
Expected: No errors (or only unrelated ones from other files)

**Step 3: Commit**

```bash
git add src/compositions/SearchBar/schema.ts
git commit -m "feat(remotion): add SearchBar composition schema"
```

---

### Task 2: Create the Dumb SearchBar Component (1:1 Clone)

This is the core task. Build a stateless rendering component that matches the extension's SearchBar pixel-for-pixel but takes all state as props instead of using hooks.

**Files:**
- Create: `src/components/SearchBar/SearchBarStatic.tsx`

**Reference files (extension, via `@/` alias — DO NOT import, recreate as dumb components):**
- `../../REIS/reis-extension/src/components/SearchBar/index.tsx` — layout, classes, structure
- `../../REIS/reis-extension/src/components/SearchBar/SearchResultItem.tsx` — result row rendering
- `../../REIS/reis-extension/src/components/SearchBar/SearchFooter.tsx` — keyboard shortcuts footer

**Step 1: Create the static SearchBar component**

The component must accept these props and render the exact same JSX as the extension:

```typescript
import React from "react";
import { Search, X, BookOpen, ChevronUp, ChevronDown } from "lucide-react";
import type { SearchResultItem as SearchResultType } from "../../compositions/SearchBar/schema";

interface SearchBarStaticProps {
  /** Current text shown in the input */
  queryText: string;
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Whether loading spinner is shown */
  isLoading: boolean;
  /** Results to display in dropdown */
  results: SearchResultType[];
  /** Index of highlighted result (-1 for none) */
  selectedIndex: number;
  /** Whether to show the X clear button */
  showClear: boolean;
  /** Whether to show cursor blinking */
  showCursor: boolean;
  /** Cursor opacity (for blinking effect) */
  cursorOpacity: number;
}
```

**Critical:** Copy the exact className strings from the extension components. The structure must be:
1. Outer wrapper: `w-full h-full flex items-center`
2. Inner container: `flex-1 max-w-3xl mx-auto flex items-center gap-2`
3. Input container with border glow when open: `border-primary shadow-[0_0_0_3px_rgba(121,190,21,0.15)]`
4. Dropdown: `absolute top-full left-0 right-0 bg-base-100 border border-t-0 border-base-300 rounded-b-lg shadow-lg overflow-hidden flex flex-col`
   - Note: Remove `animate-in fade-in slide-in-from-top-2 duration-200` CSS animation classes (they drift in Remotion headless rendering). The composition will handle entrance via `interpolate()`.
5. Result items: Same as `SearchResultItem.tsx` — icon (violet BookOpen for subjects), title, dot, detail text
6. Footer: Same as `SearchFooter.tsx` — kbd elements with arrows, enter, esc
7. Add a blinking cursor after the query text using a `<span>` with `|` character and controlled opacity

**Step 2: Verify it renders in isolation**

Run: `cd /root/reis-dev/reis-remotion && npx tsc --noEmit 2>&1 | head -20`
Expected: No type errors in the new file

**Step 3: Commit**

```bash
git add src/components/SearchBar/SearchBarStatic.tsx
git commit -m "feat(remotion): add static SearchBar component (1:1 extension clone)"
```

---

### Task 3: Create the SearchBar Composition (Frame-Driven Animation)

**Files:**
- Create: `src/compositions/SearchBar/index.tsx`

**Step 1: Write the composition**

```typescript
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { Background } from "../../components/Background";
import { MendeluEnvironment } from "../../Environment";
import { SoundEffect } from "../../components/SoundEffect";
import { SearchBarStatic } from "../../components/SearchBar/SearchBarStatic";
import type { SearchBarProps } from "./schema";

// Timeline constants (frames @ 30fps)
const ENTRANCE_START = 0;
const ENTRANCE_END = 30;
const TYPE_START = 30;
const TYPE_END = 120;
const LOADING_START = 120;
const LOADING_END = 140;
const RESULTS_START = 140;
const RESULTS_END = 190;
const NAVIGATE_START = 190;
const NAVIGATE_END = 215;
const SELECT_START = 215;

export const SearchBarComposition: React.FC<SearchBarProps & { children?: React.ReactNode }> = (props) => {
  const { query, results, selectedResultIndex, background, scale = 1 } = props;
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Phase 1: Entrance
  const entrance = spring({ frame, fps, config: { damping: 20 } });
  const entranceOpacity = interpolate(entrance, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const entranceScale = interpolate(entrance, [0, 1], [0.95, 1], { extrapolateRight: "clamp" });

  // Phase 2: Typewriter
  const totalChars = query.length;
  const charsVisible = frame < TYPE_START ? 0 :
    Math.min(totalChars, Math.floor(interpolate(frame, [TYPE_START, TYPE_END], [0, totalChars], { extrapolateRight: "clamp" })));
  const queryText = query.slice(0, charsVisible);

  // Cursor blink (every 15 frames)
  const cursorOpacity = frame >= TYPE_START && frame < RESULTS_END
    ? (Math.floor(frame / 15) % 2 === 0 ? 1 : 0)
    : 0;

  // Phase 3: Loading
  const isLoading = frame >= LOADING_START && frame < RESULTS_START;

  // Phase 4: Results (staggered entrance — controlled by opacity per result)
  const isOpen = frame >= LOADING_START;
  const visibleResults = frame < RESULTS_START ? [] :
    results.filter((_, i) => frame >= RESULTS_START + i * 5);

  // Phase 5: Navigation
  let currentSelectedIndex = -1;
  if (frame >= NAVIGATE_START) {
    // Animate from 0 down to selectedResultIndex
    const navigateProgress = Math.min(
      selectedResultIndex,
      Math.floor(interpolate(frame, [NAVIGATE_START, NAVIGATE_END], [0, selectedResultIndex], { extrapolateRight: "clamp" }))
    );
    currentSelectedIndex = navigateProgress;
  }

  // Phase 6: Select — pulse effect
  const selectPulse = frame >= SELECT_START
    ? spring({ frame: frame - SELECT_START, fps, config: { damping: 10, mass: 0.3 } })
    : 0;

  return (
    <AbsoluteFill className="overflow-hidden">
      {background && <Background {...background} />}

      {/* Sound: typing start */}
      <Sequence from={TYPE_START}>
        <SoundEffect type="TOGGLE_ON" volume={0.3} />
      </Sequence>

      {/* Sound: result selected */}
      <Sequence from={SELECT_START}>
        <SoundEffect type="SWOOSH" volume={0.5} />
      </Sequence>

      <MendeluEnvironment
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: "transparent" }}
      >
        <div
          style={{
            opacity: entranceOpacity,
            transform: `scale(${scale * entranceScale})`,
            width: "700px",
          }}
        >
          <SearchBarStatic
            queryText={queryText}
            isOpen={isOpen}
            isLoading={isLoading}
            results={visibleResults}
            selectedIndex={currentSelectedIndex}
            showClear={charsVisible > 0}
            showCursor={frame >= TYPE_START && frame < RESULTS_END}
            cursorOpacity={cursorOpacity}
          />
        </div>
      </MendeluEnvironment>
    </AbsoluteFill>
  );
};
```

**Step 2: Verify TypeScript compiles**

Run: `cd /root/reis-dev/reis-remotion && npx tsc --noEmit 2>&1 | head -20`

**Step 3: Commit**

```bash
git add src/compositions/SearchBar/index.tsx
git commit -m "feat(remotion): add SearchBar composition with frame-driven animation"
```

---

### Task 4: Register in Root.tsx

**Files:**
- Modify: `src/Root.tsx`

**Step 1: Add imports and composition registration**

Add at top of file:
```typescript
import { SearchBarComposition } from "./compositions/SearchBar";
import { SearchBarSchema } from "./compositions/SearchBar/schema";
```

Add inside the `<Folder name="Building-Blocks">` section, before the closing `</Folder>`:
```tsx
<Composition
  id="SearchBar"
  component={SearchBarComposition}
  durationInFrames={240}
  fps={30}
  width={1920}
  height={1080}
  schema={SearchBarSchema}
  defaultProps={{
    query: "podnikova ekonomi",
    selectedResultIndex: 7,
    background: { type: "stars", starsCount: 500 },
    scale: 2,
  }}
/>
```

**Step 2: Verify Remotion Studio loads**

Run: `cd /root/reis-dev/reis-remotion && npx remotion studio --log=error 2>&1 | head -5`
Expected: Studio starts without crashes. Navigate to SearchBar composition in browser.

**Step 3: Commit**

```bash
git add src/Root.tsx
git commit -m "feat(remotion): register SearchBar in Building-Blocks"
```

---

### Task 5: Visual QA and Polish

**Step 1: Open Remotion Studio and scrub through the composition**

Run: `cd /root/reis-dev/reis-remotion && npm run dev`

Check each phase visually:
- Frame 0-30: SearchBar entrance (fade + scale spring)
- Frame 30-120: Characters typed one by one
- Frame 120-140: Loading spinner visible
- Frame 140-190: Results appear staggered
- Frame 190-215: Selection highlight moves down to index 7
- Frame 215-240: Selection pulse

**Step 2: Compare with extension**

Open the extension's SearchBar side-by-side. Verify:
- Same border radius, padding, colors
- Same icon (BookOpen in violet for subjects)
- Same dot separator styling between title and detail
- Same footer kbd styling
- Same focus glow (`shadow-[0_0_0_3px_rgba(121,190,21,0.15)]`)

**Step 3: Fix any discrepancies**

Adjust className strings in `SearchBarStatic.tsx` until pixel-perfect.

**Step 4: Commit**

```bash
git add -A
git commit -m "fix(remotion): polish SearchBar composition visual fidelity"
```

---

### Task 6: Write Tests

**Files:**
- Create: `src/__tests__/SearchBar.test.tsx`

**Step 1: Write test file**

```typescript
import { describe, test, expect, vi } from "vitest";
import { SearchBarSchema } from "../compositions/SearchBar/schema";

// Mock Remotion hooks
vi.mock("remotion", () => ({
  useCurrentFrame: () => 0,
  useVideoConfig: () => ({ fps: 30, width: 1920, height: 1080, durationInFrames: 240 }),
  AbsoluteFill: ({ children }: any) => <div>{children}</div>,
  Sequence: ({ children }: any) => <div>{children}</div>,
  interpolate: vi.fn((value, input, output) => output[0]),
  spring: vi.fn(() => 0),
  staticFile: (f: string) => f,
}));

describe("SearchBar Schema", () => {
  test("parses with defaults", () => {
    const result = SearchBarSchema.parse({});
    expect(result.query).toBe("podnikova ekonomi");
    expect(result.results).toHaveLength(9);
    expect(result.selectedResultIndex).toBe(7);
  });

  test("validates custom props", () => {
    const result = SearchBarSchema.parse({
      query: "test",
      results: [{ id: "1", title: "Test", type: "subject" }],
      selectedResultIndex: 0,
    });
    expect(result.query).toBe("test");
    expect(result.results).toHaveLength(1);
  });
});
```

**Step 2: Run tests**

Run: `cd /root/reis-dev/reis-remotion && npx vitest run src/__tests__/SearchBar.test.tsx`
Expected: All tests pass

**Step 3: Commit**

```bash
git add src/__tests__/SearchBar.test.tsx
git commit -m "test(remotion): add SearchBar schema tests"
```
