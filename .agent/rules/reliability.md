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
Combine forces to ensure reliability.
- **Tool**: `vitest` + `@remotion/player` (Thumbnail).
- **Action**: Verify the "Happy Path" and the "Involution" (Edge cases).

```tsx
test('It handles the "stupid" case gracefully', () => {
   // Test the edge case you identified in step 1
});
```

## Workflow: Validate -> Implement -> Test for Failure
1.  **Define the Interface (The Contract)**: Write the Zod schema first.
2.  **Invert the Logic**: Write a test for the failure state.
3.  **Implement**: Write the component to satisfy the schema and pass the test.
