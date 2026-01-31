---
description: Setup testing environment for Remotion using Vitest
---

1. Install dependencies
// turbo
```bash
npm install -D vitest jsdom @testing-library/react @remotion/player
```

2. Create `vitest.config.ts`
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

3. Update `package.json`
Add the test script:
```json
"scripts": {
  "test": "vitest"
}
```

4. Create a sample test
Create `src/__tests__/component.test.tsx` to verify setup.
