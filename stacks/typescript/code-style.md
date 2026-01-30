---
version: 0.1.0
updated: 2026-01-30
---

---
version: 0.1.0
updated: 2026-01-30
---

# TypeScript Code Style

## !! CRITICAL !! Core Philosophy

**Modern, functional-first TypeScript.**

- Default to pure functions and procedural code
- Avoid class-based encapsulation unless compelling reason
- Strong typing - avoid `any`
- Let TypeScript's type inference work for you

---

## Functional-First Pattern

**Prefer pure functions over class encapsulation:**

```typescript
// ✅ Good - pure functions
function processUserData(user: User): ProcessedData {
  const validated = validateUser(user);
  const transformed = transformData(validated);
  return saveResult(transformed);
}

function validateUser(user: User): ValidatedUser {
  if (!user.email) {
    throw new Error("Email required");
  }
  return { ...user, validated: true };
}

// ❌ Avoid - unnecessary class encapsulation
class UserProcessor {
  constructor(private user: User) {}

  process(): ProcessedData {
    this.validate();
    this.transform();
    return this.save();
  }
}
```

**Use classes/objects for:**
- Data models (types/interfaces)
- Framework requirements (React components, etc.)
- When there's a compelling architectural reason

---

## !! CRITICAL !! Avoid `any`

**Never use `any` - it defeats TypeScript's purpose.**

```typescript
// ❌ Avoid - loses all type safety
function processData(data: any): any {
  return data.someProperty;
}

// ✅ Good - use proper types
function processData(data: UserData): ProcessedResult {
  return data.someProperty;
}

// ✅ Good - use unknown when type is truly unknown
function processData(data: unknown): ProcessedResult {
  if (isUserData(data)) {
    return data.someProperty;
  }
  throw new Error("Invalid data");
}
```

**If you need flexible types:**
- Use generics: `<T>`
- Use `unknown` and type guards
- Define union types: `string | number`
- Create proper interfaces

---

## Type Inference

**Let TypeScript infer types when obvious:**

```typescript
// ✅ Good - inference works
const users = getUsers(); // TypeScript knows the type
const count = users.length;

// ❌ Avoid - unnecessary annotation
const users: User[] = getUsers();
```

**Do annotate:**
- Function parameters
- Function return types (for clarity)
- When inference produces wrong type
