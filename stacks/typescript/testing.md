---
version: 0.1.1
updated: 2026-01-30
---

# TypeScript Testing

## Tools

- **vitest** - Testing framework (fast, Vite-powered)

---

## Test Organization

**Test files:** `*.test.ts` or `*.spec.ts`

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// math.test.ts
import { describe, it, expect } from 'vitest';
import { add } from './math';

describe('add', () => {
  it('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('adds negative numbers', () => {
    expect(add(-1, -1)).toBe(-2);
  });
});
```

---

## Testing Guidelines

**TypeScript-specific:**
- Test files: `*.test.ts` or `*.spec.ts`
- Use `describe` for grouping tests
- Use `it` or `test` for individual test cases
- Use `expect` for assertions
- Vitest has built-in TypeScript support

---

## Common Patterns

**Testing async functions:**

```typescript
import { describe, it, expect } from 'vitest';

describe('async function', () => {
  it('fetches data successfully', async () => {
    const result = await fetchData();
    expect(result).toBeDefined();
  });
});
```

**Testing errors:**

```typescript
import { describe, it, expect } from 'vitest';

describe('validation', () => {
  it('throws on invalid input', () => {
    expect(() => validate(invalidData)).toThrow('Invalid');
  });
});
```
