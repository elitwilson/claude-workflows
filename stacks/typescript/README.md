---
version: 0.1.0
updated: 2026-01-30
---

# TypeScript Stack

## Philosophy

**Modern, functional-first TypeScript.**

- Procedural code with pure functions as default
- Avoid class-based encapsulation unless compelling reason
- Strong typing - avoid `any`
- Let TypeScript's type inference work for you

---

## Tooling

- **pnpm** - Package management
- **vitest** - Testing framework
- **TypeScript compiler (tsc)** - Type checking

**Note:** Build tools (Vite, webpack, etc.) and frameworks (React, Vue, etc.) are project-specific - document those in project CLAUDE.md.

---

## Quick Commands

```bash
# Setup
pnpm install                # Install dependencies
pnpm add <package>          # Add dependency
pnpm add -D <package>       # Add dev dependency

# Testing
pnpm test                   # Run tests (typically: vitest)

# Type checking
tsc --noEmit                # Type check without building
```

---

## Project Structure

Varies by project type (frontend app, library, backend, etc.). Follow project conventions.

---

## Stack Rules

- **Code style:** See [code-style.md](code-style.md)
- **Testing patterns:** See [testing.md](testing.md)
