# SearchBar Composition Design

## Goal
Create a Building Block composition that demos the SearchBar with a typewriter search for "podnikova ekonomi", showing real results across faculties, navigating to the PEF result, and selecting it.

## Critical Requirement
The SearchBar must be a **1:1 visual replica** of the extension's SearchBar component. This is 90% of the work — the frame-driven animation logic is secondary to pixel-perfect fidelity.

## Approach
Import and adapt the real SearchBar components from `@/components/SearchBar/` via the existing alias. Strip out all runtime logic (hooks, chrome APIs, event handlers) and replace with frame-driven props. The rendered HTML/CSS must be identical.

## Components to Reuse from Extension
- `SearchBar/index.tsx` — input field layout, styling, border glow on focus
- `SearchBar/SearchResultItem.tsx` — result row rendering (icon, title, detail, highlight)
- `SearchBar/SearchFooter.tsx` — keyboard shortcuts footer
- Icons: `Search`, `X` from lucide-react

## Components to Build in Remotion
- `SearchBarComposition` — frame-driven wrapper that controls:
  - Input value (typewriter)
  - Dropdown open/closed
  - Which results are visible
  - Which result is highlighted
  - Loading state

## Schema Props
- `query` (string, default: "podnikova ekonomi")
- `results` (array of {title, code, semester?, faculty})
- `selectedResultIndex` (number, default: 7 — "Podniková ekonomika 1 · EBC-PE · ZS 2025/2026 · PEF")
- `background` (optional Background)

## Mock Results Data
```
Podniková ekonomika        · D-PODEK · ZF
Podniková ekonomika        · EKO     · ZS 2025/2026 · AF
Podniková ekonomika        · RRPEK   · LS 2025/2026 · FRRMS
Podniková ekonomika        · EKO     · LS 2025/2026 · AF
Podniková ekonomika (FT)   · POEKF   · LS 2025/2026 · ZF
Podniková ekonomika (RSZ)  · POEKR   · ZS 2025/2026 · ZF
Podniková ekonomika (ZI)   · PODEK   · ZS 2025/2026 · ZF
Podniková ekonomika 1      · EBC-PE  · ZS 2025/2026 · PEF
Podniková ekonomika 1      · EBC-PE  · LS 2025/2026 · PEF
```

## Animation Timeline (240 frames @ 30fps = 8s)

| Phase      | Frames  | Description |
|------------|---------|-------------|
| Setup      | 0–30    | SearchBar springs in (scale 0.95→1, opacity 0→1) |
| Typing     | 30–120  | Characters typed ~5f/char, cursor blinks |
| Loading    | 120–140 | Spinner in dropdown |
| Results    | 140–190 | Results stagger in (~5f apart) |
| Navigate   | 190–215 | Highlight moves down to selectedResultIndex |
| Select     | 215–240 | Highlight pulse, sound effect |

## Sound Effects
- Typing start: `TOGGLE_ON` (0.3)
- Result select: `SWOOSH` (0.5)

## Registration
Under Building-Blocks folder in Root.tsx as `SearchBar`, 240 frames, 30fps, 1920x1080.
