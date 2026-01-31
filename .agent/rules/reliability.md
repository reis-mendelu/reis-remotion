---
trigger: always_on
---

# Charlie Munger Reliability Protocol

> "It is remarkable how much long-term advantage people like us have gotten by trying to be consistently not stupid, instead of trying to be very intelligent." - Charlie Munger
## 1. Invert, Always Invert
Before building, ask: **"What would cause this system to fail miserably?"**
- *Failure*: Rendering crashes at hour 10 because a prop was undefined.
- *Solution*: Validate all inputs at minute 0.
## 2. The "Stupidity Filter" (Schema Validation)
Never trust inputs. Inputs are the primary source of entropy and failure.
- **Tool**: `zod` and `@remotion/zod-types`.
- **Action**: Define strict schemas for every managed component/composition.
- **Rule**: If it isn't in the schema, it doesn't exist.
```tsx
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
export const compositionSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  color: zColor(), // Enforces valid hex/css color
  duration: z.number().positive(),
});
// The system fails FAST (compile time or bootstrap) if data is bad.
export const MyComp: React.FC<z.infer<typeof compositionSchema>> = (props) => { ... }
```
## 3. Verify via Lollapalooza (Unit Testing)
Combine forces to ensure reliability by verifying both the "Happy Path" and the "Involution" (Edge cases).
- **Tool**: `vitest` + `@remotion/player` (for `Thumbnail` testing).
- **Protocol**:
    1. **Schema Integrity**: Verify that components fail correctly when Zod schemas are violated (using `expect().toThrow()` or checking render output).
    2. **Frame Accuracy**: Use `Thumbnail` to render specific frames and verify CSS/DOM state (e.g., check that `interpolate` result is reflected in styles).
    3. **Environmental Isolation**: Ensure tests run without global mocks that wouldn't exist in the Remotion renderer.
```tsx
import { render, screen } from '@testing-library/react';
import { Thumbnail } from '@remotion/player';
test('It handles the "stupid" case (invalid props) gracefully', () => {
   // Verify schema validation or fallback behavior
});
test('It produces frame-accurate results', async () => {
  render(<Thumbnail frameToDisplay={30} ... />);
  const element = await screen.findByTestId('interpolated-element');
  expect(element.style.left).toBe('14px'); // Verify interpolation
});
```
## 4. Environmental Independence (Isolation)
Never assume the component lives in the main app environment. Remotion is a saltwater lake (Puppeteer/Headless); the Extension is a saltwater ocean.
- **Fail Mode**: Importing `App.tsx` or global providers to "get styles right." This creates a dependency lollapalooza that crashes on `chrome.*` APIs.
- **Solution**: **Surgical Context Mocking**. 
    - Identify the specific CSS class hierarchy (e.g., `.reis-sidebar`) and apply it in `Environment.tsx`.
    - Extract "dumb" UI components. If a component uses complex hooks, refactor it to accept data as props before importing it into Remotion.
## 5. Async Safety (The Blank Frame Prevention)
Remotion renders frame-by-frame. If data or fonts aren't ready, you get a blank video.
- **Fail Mode**: Relying on standard `useEffect` for data fetching or font loading without notifying Remotion's renderer.
- **Solution**: Always use `delayRender()` and `continueRender()` for async operations. Use `@remotion/google-fonts` as it handles this automatically.
## 6. Asset Determinism
- **Fail Mode**: Using relative paths `../assets/logo.png` or external URLs that might be flaky.
- **Solution**: Use `staticFile("logo.png")` for all local assets placed in the `public/` folder. This ensures assets are bundled correctly during the `remotion render` command.
## 7. Layout Integrity
Videos have fixed aspect ratios. App UIs are fluid.
- **Fail Mode**: Using `vh` or `vw` units which behave unpredictably in the headless browser's viewport.
- **Solution**: Use `useVideoConfig()` to get `width` and `height`. Express internal layout in `px` or as a percentage of the video container.
## 8. The "Animation Trap" (Frame Accuracy)
Wall-clock time is the enemy of deterministic video.
- **Fail Mode**: Using Tailwind `transition-*`, `animate-*`, or default CSS transitions. These will drift or "jitter" during high-load renders.
- **Solution**: Always use `useCurrentFrame()` and `interpolate()`. 
1.  **Define the Interface (The Contract)**: Write the Zod schema first.
2.  **Invert the Logic**: Write a test for the failure state.
3.  **Implement**: Write the component to satisfy the schema and pass the test.
