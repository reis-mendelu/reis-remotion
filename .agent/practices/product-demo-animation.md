# Product Demo Animation Best Practices
## Apple/Google Approach + Remotion Implementation

This document codifies the principles and practices we applied when creating the FilesHint animation for reIS, combining industry-standard product demo techniques with Remotion-specific implementation patterns.

---

## Core Philosophy: Clarity Over Complexity

> "The best product demos don't show everything—they show one thing perfectly."
> — Apple Product Marketing Playbook

### The One Hero Feature Rule

**Principle**: Focus demo time on a single core feature rather than rushing through many features.

**Implementation**:
- ✅ FilesHint demonstrates ONE workflow: select → download → celebrate
- ✅ 10 seconds dedicated to showing this flow completely
- ❌ Avoid: Showing multiple unrelated features in rapid succession

**Why**: Cognitive load. Users retain 1-2 key ideas from a product demo, not 10.

---

## 1. Animation Timing

### Demo Speed vs Production Speed

**Principle**: Product demos should be ~3× slower than production UI.

**Rationale**:
- Viewers need time to **comprehend** what's happening
- Success moments should **linger** for emotional impact
- Rushed animations feel like software bugs, not features

**Implementation (FilesHint)**:
```typescript
// ❌ Production timing (too fast for demo)
const clickDelay = 10; // 0.33s

// ✅ Demo timing (gives time to read)
const readyDuration = 40; // 1.33s before click
```

**Apple Keynote Standard**:
- UI transitions: 600-800ms (vs 200-300ms production)
- Success moments: Linger 1.5-2 seconds
- Between-action gaps: 0.5-1 second (comprehension buffer)

---

## 2. Sequential vs Simultaneous

### The Sequential Download Pattern

**Principle**: Show processes one-at-a-time, not simultaneously.

**Why**: Simultaneous animations create visual noise. Sequential creates narrative.

**Implementation**:
```typescript
// ✅ Sequential (clear narrative)
// File 1: Frames 106-146 (downloads alone)
// File 2: Frames 146-186 (starts after File 1 completes)
// File 3: Frames 186-226 (starts after File 2 completes)

// ❌ Simultaneous (confusing)
// All files: Frames 106-146 (download together)
```

**Pattern**: Google Drive, Dropbox, iCloud all show downloads sequentially in demos.

---

## 3. Visual Hierarchy & State Transitions

### The Three-State Pattern

**Principle**: Every interactive element should have clear visual states with smooth transitions.

**Implementation (FilesHint)**:
```typescript
// 1. Selected (brand color #79be15)
isSelected ? "bg-[#79be15]" : "border-white/10"

// 2. Downloading (progress ring, same brand color)
<circle stroke="#79be15" strokeDashoffset={progressOffset} />

// 3. Complete (success color #10b981 with celebration)
isDownloaded ? "bg-[#10b981]" : "bg-[#79be15]"
```

**Color Psychology**:
- **Brand color** = "in progress" (active, energetic)
- **Success green** = "complete" (achievement, positive outcome)
- Clear transition communicates state change without words

---

## 4. Celebration Animations

### The Spring Bounce Pattern

**Principle**: Success moments deserve celebration, but keep it subtle and organic.

**Implementation**:
```typescript
const celebrationProgress = spring({
  frame: frame - celebrationStartFrame,
  fps,
  config: { damping: 10, mass: 0.3 }, // Subtle bounce
});

celebrationScale = interpolate(celebrationProgress, [0, 1], [1, 1.05]);
```

**Guidelines**:
- Scale: 1.0 → 1.05-1.1 (not >1.2, feels too aggressive)
- Duration: 30-40 frames (1-1.3s) with spring physics
- Glow effect: Pulse opacity 0 → 1 → 0.3 (lingers)
- Stagger: 10-15 frame delays between multiple completions

**Why Spring Physics**:
- Feels organic and alive (vs linear/ease-out feels mechanical)
- Communicates "success" through motion language
- Industry standard: iOS animations, Material Design

---

## 5. No Cursor Positioning

### The "UI State Changes Only" Rule

**Principle**: In product demos, show UI transformations without cursor movement.

**Rationale**:
- Cursor positioning is fragile (breaks on viewport changes)
- Focuses attention on the UI, not the interaction mechanism
- Cleaner for presenting across different screen sizes

**Implementation**:
```typescript
// ✅ Show state changes directly
const isSelected = selectedIds.includes(file.link);

// ❌ Don't animate cursor position
// ❌ const cursorX = interpolate(frame, [0, 30], [0, 100]);
```

**Alternative**: Use state transitions + button pulses to imply user action.

---

## 6. Remotion-Specific Best Practices

### Frame-Accurate Timing (Munger Protocol)

**Principle**: All animation logic uses frame numbers, never milliseconds or CSS transitions.

**Why**:
- Remotion renders frame-by-frame (deterministic)
- CSS transitions drift during high-load rendering
- Frame numbers = reproducible across renders

**Implementation**:
```typescript
// ✅ Frame-accurate
if (frame >= 56 && frame < 96) buttonState = 'ready';

// ❌ CSS transition (will jitter)
// className="transition-all duration-300"
```

### Schema Validation First

**Principle**: Define Zod schema before implementing component.

**Pattern**:
```typescript
// 1. Define contract
export const FilesHintSchema = z.object({
  downloadProgress: z.record(z.string(), z.number().min(0).max(1)).optional(),
  buttonState: z.enum(['hidden', 'ready', 'clicking', 'downloading', 'complete']).optional(),
});

// 2. Component uses inferred type
export const FilesHint: React.FC<z.infer<typeof FilesHintSchema>> = (props) => {
  // TypeScript ensures props match schema
};
```

**Benefits**: Runtime validation + compile-time safety.

### Async Safety with delayRender

**Principle**: All async operations must use `delayRender()` + `continueRender()`.

**Why**: Remotion needs to know when async work completes to render correctly.

**Pattern** (for fonts, data fetching):
```typescript
const [handle] = useState(() => delayRender());

useEffect(() => {
  loadFont().then(() => continueRender(handle));
}, [handle]);
```

---

## 7. Audio Integration

### The Sound Design Stack

**Principle**: Use 3-4 distinct sound types, not one sound repeated.

**Implementation (FilesHint)**:
```typescript
// Selection: Soft click (TOGGLE_ON at 0.3 volume)
<Sequence from={20}><SoundEffect type="TOGGLE_ON" volume={0.3} /></Sequence>

// Button click: Louder (TOGGLE_ON at 0.4 volume)
<Sequence from={96}><SoundEffect type="TOGGLE_ON" volume={0.4} /></Sequence>

// Completion: Success chime (SUCCESS varied volumes)
<Sequence from={226}><SoundEffect type="SUCCESS" volume={0.4} /></Sequence>
```

**Volume Hierarchy**:
- Background ambient: 0.1-0.2
- Micro-interactions: 0.3-0.4
- Important events: 0.5-0.6
- Never exceed 0.7 (audio fatigue)

---

## 8. Typography & Authority

### Component UI vs Landing Hero

**Principle**: Contextual typography authority (from Munger Protocol).

**Pattern**:
```typescript
// Landing/Hero slides: Extra Black (900) + All Caps
<ProfessionalText mode="minimalist" text="MODERNIZOVANÝ reIS" />

// Component UI: Bold (700) + Mixed Case
<button className="font-bold">Stáhnout 3 soubory</button>
```

**Why**: All-caps in dense UI feels like a warning label. Reserve for impact moments.

---

## 9. Overflow & Container Management

### Celebration Animation Containment

**Principle**: Scale transformations must respect container boundaries.

**Implementation**:
```typescript
// Container: overflow-hidden prevents breakout
<div className="overflow-hidden">
  {/* Item: subtle scale */}
  <div style={{ transform: `scale(${1.05})` }}>
```

**Guidelines**:
- Scale limit: 1.05-1.1 max for contained elements
- Use `overflow-hidden` on parent for safety
- Test at multiple viewport sizes

---

## 10. Timeline Architecture

### The 4-Phase Pattern

**Structure for Demo Animations**:

1. **Setup/Selection** (20-30% of duration)
   - Establish context
   - Show user input/selection
   
2. **Action Trigger** (5-10% of duration)
   - Button click, confirmation
   - Brief but visible
   
3. **Process** (40-50% of duration)
   - The "what's happening" phase
   - Progress indicators, loading states
   
4. **Completion** (20-30% of duration)
   - Success state
   - Celebration + linger

**FilesHint Applied**:
- Phase 1 (Selection): 36 frames / 300 = 12%
- Phase 2 (Button): 50 frames / 300 = 17%
- Phase 3 (Progress): 120 frames / 300 = 40%
- Phase 4 (Celebration): 94 frames / 300 = 31%

---

## 11. Progress Indicators

### SVG Circular Progress

**Pattern**:
```typescript
const circumference = 2 * Math.PI * radius;
const progressOffset = circumference * (1 - progress);

<circle
  strokeDasharray={circumference}
  strokeDashoffset={progressOffset}
  strokeLinecap="round" // Smooth ends
/>
```

**Best Practices**:
- Use `transform: rotate(-90deg)` to start at top (12 o'clock)
- Brand color for progress ring
- White/10 opacity for background ring
- Radius 7-8px for small indicators (14-16px touch targets)

---

## 12. 3D Integration (Optional Enhancement)

### Apple-Style Depth

**When to Use**: Landing/hero moments, not information-dense UI.

**Pattern**:
```typescript
// Entrance only (not continuous rotation)
const entrance = spring({ frame, fps, config: { damping: 20 } });
const entranceY = interpolate(entrance, [0, 1], [20, 0]);

<div style={{
  transform: `scale(${scale}) translateY(${entranceY}px)`,
  boxShadow: `0 20px 60px rgba(0,0,0,0.3)`,
}} />
```

**Avoid**: Continuous 3D rotation during interaction (nauseating).

---

## Quick Reference: Do's and Don'ts

### ✅ Do

- Give viewers time to read (1-2s visible before action)
- Use sequential flow for clarity
- Celebrate success with subtle spring animations
- Test at multiple playback speeds
- Use frame numbers for all timing
- Define Zod schemas first
- Keep scale transformations <1.1 in containers

### ❌ Don't

- Rush through interactions (<0.5s visible)
- Animate multiple things simultaneously
- Use CSS transitions in Remotion
- Position cursors manually
- Exceed 1.2 scale in celebration bounces
- Use milliseconds for timing
- Mix production and demo speeds

---

## File Structure Best Practices

### Composition Organization

```
src/compositions/
  SubjectDrawer/
    index.tsx           # Main composition (orchestrator)
    FilesHint.tsx       # Specific interaction demo
    schema.ts           # Zod schemas
  
src/components/
  SubjectDrawer/
    Header.tsx          # Reusable header component
    Tabs/
      FileList.tsx      # Reusable file list
```

**Principle**: Compositions orchestrate, components render.

---

## Measurement & Iteration

### How to Know If It's Working

1. **First Watch Test**: Can someone understand the feature without narration?
2. **Speed Test**: Can you play at 0.75× and still feel natural?
3. **Satisfaction Test**: Does the success moment feel rewarding?
4. **Clarity Test**: Can you describe what happened in one sentence?

**FilesHint Passes**:
1. ✅ "Downloads files with progress"
2. ✅ Feels natural at 0.75× speed
3. ✅ Green checkmarks + bounce = satisfying
4. ✅ "Select files, click download, see progress, celebrate completion"

---

## Implementation Checklist

When creating a new product demo animation:

- [ ] Define the ONE thing you're demonstrating
- [ ] Sketch the 4-phase timeline (setup, trigger, process, completion)
- [ ] Write Zod schema with all state variables
- [ ] Implement frame-accurate state transitions
- [ ] Add sequential flow (no simultaneous chaos)
- [ ] Implement spring-based celebrations
- [ ] Add audio cues (3-4 distinct sounds)
- [ ] Test with overflow-hidden containers
- [ ] Slow down by 2-3× vs production speed
- [ ] Add 1-2s pause before critical actions
- [ ] Test in Remotion Studio at multiple timeline positions
- [ ] Review: Would Apple show this in a keynote?

---

## Resources & References

**Industry Examples**:
- Apple WWDC Demos (wwdc.io)
- Google I/O Product Demos
- Stripe Dashboard Demos
- Linear App Animations

**Technical**:
- Remotion Documentation: remotion.dev
- Spring Physics: remotion.dev/docs/spring
- Zod Validation: zod.dev

**Design Systems**:
- Apple Human Interface Guidelines
- Material Design Motion
- IBM Carbon Animation

---

*This guide represents the distilled practices from creating the FilesHint animation, following Apple/Google product demo standards while adhering to Remotion best practices and the Munger Reliability Protocol.*
