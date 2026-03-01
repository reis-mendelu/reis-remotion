# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Remotion Studio preview
npm run build        # Bundle project
npm run lint         # ESLint + TypeScript type-check
npm test             # Run vitest (jsdom environment)
npx vitest run src/__tests__/SubjectDrawer.test.tsx  # Run a single test
npx remotion render <CompositionId> out.mp4          # Render a specific composition
```

## Architecture

This is a **Remotion 4.0** project that produces promotional videos and print posters for the reIS university app. It renders UI mockups (SubjectDrawer, OutlookSync) as frame-accurate animations.

### Key Structure

- `src/index.ts` → registers `RemotionRoot` via `registerRoot()`
- `src/Root.tsx` → composition registry organized into folders: Official-Sequences, Building-Blocks, Posters
- `src/compositions/` → top-level orchestrators (SubjectDrawer, OutlookSync, BrandedEndSlide, IntroPoster). Each has an `index.tsx` + `schema.ts` (Zod validation)
- `src/components/` → reusable rendering components (tabs, backgrounds, calendar, text engine)
- `src/audio/AudioMap.ts` → sound effect registry (Kenney UI Audio pack), used via `<SoundEffect type="SWOOSH" />`

### Shared Code

The `@/*` path alias resolves to `../../REIS/reis-extension/src/` (the main reIS browser extension). CSS is also imported from there. Components imported from the extension must be "dumb" (no `chrome.*` APIs or complex hooks).

### Core Patterns

**Schema-first**: Every composition defines a Zod schema. Props are `z.infer<typeof schema>`. Validate inputs at composition boundaries.

**Frame-accurate animation**: Always use `useCurrentFrame()` + `interpolate()` / `spring()`. Never use CSS `transition-*` or `animate-*` classes — they drift during headless rendering.

**Asset loading**: Use `staticFile("filename")` for assets in `public/`. Use `delayRender()` / `continueRender()` for any async operations (fonts, data).

**Layout**: Use `px` units and `useVideoConfig()` for dimensions. Avoid `vh`/`vw` units.

### Testing

Tests use `vitest` + `@testing-library/react` + `@remotion/player`'s `Thumbnail` component. Remotion hooks (`useVideoConfig`, `useCurrentFrame`) are mocked in tests. Tests verify schema validation, frame-accurate rendering, and component output.

### Animation Guidelines

- Demo animations run ~3x slower than production UI speed
- Use spring physics: `{ damping: 10, mass: 0.3 }` for celebrations
- Scale animations max 1.1 (never >1.2), contained with `overflow-hidden`
- Sequential orchestration (one action at a time), not simultaneous
- 4-phase timeline: Setup (20%) → Trigger (10%) → Process (40%) → Completion (30%)
- Audio volume: micro-interactions 0.3-0.4, important events 0.5-0.6, never >0.7

### Typography

- Hero/landing slides: Extra Black (900) + ALL CAPS
- Component UI: Bold (700) + mixed case
- `ProfessionalText` component handles typewriter animations with `*text*` highlight syntax

### Colors

- Brand: `#79BE15` (Mendelu green)
- Success: `#10B981`
- Dark background: `#111111`
