# Setting Up Claude Workflows in Monorepos

This guide explains how to structure `.claude/` directories and `CLAUDE.md` files in monorepo projects with multiple tech stacks.

## How Claude Reads CLAUDE.md Files

**Critical insight:** Claude Code recursively searches UP the directory tree from your current working directory, reading ALL `CLAUDE.md` files it encounters along the way.

Starting from your current directory, Claude reads:
1. `/etc/claude-code/CLAUDE.md` (system-wide)
2. `~/.claude/CLAUDE.md` (user-wide)
3. Every `CLAUDE.md` and `CLAUDE.local.md` from current directory up to root `/`

**What this means for monorepos:**
```
my-app/
├── .claude/rules/              # ← Always in context (core workflows)
├── backend/
│   ├── CLAUDE.md               # ← Added when working in backend/
│   └── .claude/rules/          # ← Added when working in backend/
└── frontend/
    ├── CLAUDE.md               # ← Added when working in frontend/
    └── .claude/rules/          # ← Added when working in frontend/
```

When you work in `backend/src/`, Claude loads:
- Root `.claude/rules/` (core workflows)
- `backend/CLAUDE.md` (backend-specific context)
- `backend/.claude/rules/` (Python patterns)

When you work in `frontend/src/`, Claude loads:
- Root `.claude/rules/` (core workflows)
- `frontend/CLAUDE.md` (frontend-specific context)
- `frontend/.claude/rules/` (TypeScript patterns)

This is **token-efficient** - you only load the rules relevant to where you're working.

## Recommended Monorepo Structure

```
my-app/
├── README.md                    # Human-readable project docs
├── .claude/
│   └── rules/                  # Core workflows (apply everywhere)
│       ├── tdd-workflow.md
│       ├── claude-code-usage.md
│       ├── doc-patterns.md
│       └── quality-gates.md
├── backend/
│   ├── CLAUDE.md               # Backend-specific context
│   └── .claude/
│       └── rules/              # Python-specific patterns
│           ├── code-style.md
│           └── testing.md
└── frontend/
    ├── CLAUDE.md               # Frontend-specific context
    └── .claude/
        └── rules/              # TypeScript-specific patterns
            ├── code-style.md
            └── testing.md
```

## What Goes Where

### Root `.claude/rules/` (Core Workflows)

**Purpose:** Universal rules that apply to ALL code in the repo, regardless of stack.

**Contains:**
- TDD workflow (RED → GREEN → REFACTOR)
- Git conventions (when to commit, message format)
- Documentation patterns (what to document, when)
- Claude Code tool usage preferences
- Quality gates and review standards

**Why at root:** Claude's recursive discovery means these are ALWAYS in context, no matter where you're working.

### Subproject `CLAUDE.md` (Project-Specific Context)

**Purpose:** Introduce Claude to this specific part of the codebase. Think of it as a tour guide.

**Contains:**
- What this subproject does
- Tech stack specifics
- Project-specific conventions (API routes, naming patterns, architecture decisions)
- Important gotchas or legacy patterns
- Common tasks (how to run tests, build, etc.)

**Example - `backend/CLAUDE.md`:**
```markdown
# Backend API

FastAPI-based REST API server.

## Stack
- Python 3.12, FastAPI, SQLAlchemy
- uv for dependency management
- pytest for testing

## Conventions
- API routes: `/api/v1/{resource}`
- All DB queries through SQLAlchemy ORM (no raw SQL)
- Authentication uses JWT with refresh tokens
- Migrations in `migrations/` via Alembic

## Common Tasks
- Run tests: `uv run pytest`
- Start dev server: `uv run uvicorn src.main:app --reload`
- Create migration: `uv run alembic revision --autogenerate -m "message"`

## Important Context
- User passwords hashed with bcrypt
- All timestamps stored as UTC
- Feature flags in `src/config/features.py`
```

**Example - `frontend/CLAUDE.md`:**
```markdown
# Frontend Web App

Vue.js 3 single-page application.

## Stack
- TypeScript, Vue 3, Pinia
- pnpm for dependencies
- Vitest for testing

## Conventions
- Use Composition API (not Options API)
- State management via Pinia stores in `src/stores/`
- Components organized by feature in `src/components/`
- API client auto-generated from OpenAPI spec

## Common Tasks
- Run tests: `pnpm test`
- Start dev server: `pnpm dev`
- Type check: `pnpm typecheck`
- Build: `pnpm build`

## Important Context
- Auth token stored in localStorage (key: 'auth_token')
- API base URL configured in `.env.local`
- Dark mode preference in Pinia store, persists to localStorage
```

### Subproject `.claude/rules/` (Stack-Specific Patterns)

**Purpose:** Reusable, opinionated coding patterns for this tech stack.

**Contains:**
- Code style preferences (functional-first, anti-patterns to avoid)
- Testing patterns (test organization, mocking strategies)
- Tooling preferences (formatter, linter, type checker)

**Why separate from `CLAUDE.md`:** These are **reference documentation** that apply to any project using this stack, while `CLAUDE.md` is **project-specific context**.

### Root `CLAUDE.md` (Usually Not Needed)

**Skip this for most monorepos.** The combination of `README.md` + root `.claude/rules/` + subproject files is sufficient.

**Only create root `CLAUDE.md` if you have:**
- Cross-cutting architectural conventions that affect multiple subprojects
- Shared conventions that don't fit in README (e.g., "all timestamps UTC", "error format RFC 7807")
- Truly monorepo-specific context that isn't obvious from file structure

**Example of valid root `CLAUDE.md`:**
```markdown
# My App Monorepo

## Shared Conventions
- All timestamps stored as UTC ISO 8601 strings
- Error responses follow RFC 7807 Problem Details format
- Feature flags defined in `shared/feature-flags.toml`

## Shared Code
- TypeScript types in `shared/types/`
- Generated Python types via `datamodel-codegen`
- Keep shared code minimal - prefer duplication over premature abstraction
```

## CLAUDE.md vs README.md

**README.md:**
- For humans (onboarding developers, GitHub visitors)
- Tutorial-style ("How to set up and run this")
- Public-facing

**CLAUDE.md:**
- For Claude (AI context)
- Reference-style ("How to work on this with Claude")
- Can be terse, assumes technical knowledge
- Project-specific conventions and gotchas

**Overlap is fine**, but CLAUDE.md focuses on "how to code here" while README focuses on "how to use/run this."

## Setup Strategy

### Initial Setup

1. Create root `.claude/rules/` with core workflows:
   ```bash
   mkdir -p .claude/rules
   cp ~/claude-workflows/core/*.md .claude/rules/
   ```

2. For each subproject, create `CLAUDE.md` + `.claude/rules/`:
   ```bash
   # Backend (Python)
   mkdir -p backend/.claude/rules
   cp ~/claude-workflows/stacks/python/*.md backend/.claude/rules/
   # Create backend/CLAUDE.md with project context

   # Frontend (TypeScript)
   mkdir -p frontend/.claude/rules
   cp ~/claude-workflows/stacks/typescript/*.md frontend/.claude/rules/
   # Create frontend/CLAUDE.md with project context
   ```

3. (Optional) Create root `CLAUDE.md` only if you have cross-cutting conventions.

### Keeping Rules in Sync

When you update rules in `~/claude-workflows/`, propagate changes to projects:

```bash
# Update core rules
cp ~/claude-workflows/core/*.md .claude/rules/

# Update stack-specific rules
cp ~/claude-workflows/stacks/python/*.md backend/.claude/rules/
cp ~/claude-workflows/stacks/typescript/*.md frontend/.claude/rules/
```

**Future:** Automated sync via `claude-sync` script or `mis` plugin.

## Key Principles

1. **Core rules at root** - Universal workflows live in root `.claude/rules/`, always in context
2. **Specific context at subproject level** - Each subproject has its own `CLAUDE.md` + `.claude/rules/`
3. **Stack rules are scoped** - Working in backend/ only loads Python patterns, not TypeScript
4. **CLAUDE.md is a tour guide** - Brief, project-specific intro and conventions
5. **`.claude/rules/` is reference material** - Reusable patterns and anti-patterns
6. **Root CLAUDE.md is optional** - Usually not needed; use only for truly cross-cutting concerns

## Benefits of This Approach

- **Token efficiency** - Only load relevant rules for where you're working
- **Clear separation** - Core vs stack-specific vs project-specific context
- **Scalability** - Add new subprojects without polluting existing ones
- **Reusability** - Stack rules come from `~/claude-workflows/` source of truth
- **Natural fit** - Leverages Claude's recursive discovery as designed

## Example: Working in Backend

When you run Claude Code from `my-app/backend/src/`, Claude loads:

1. **Root `.claude/rules/`** (core workflows)
   - TDD workflow
   - Git conventions
   - Documentation patterns

2. **`backend/CLAUDE.md`** (project context)
   - "This is the FastAPI backend..."
   - API route conventions
   - Authentication approach

3. **`backend/.claude/rules/`** (Python patterns)
   - Functional-first code style
   - pytest testing patterns
   - Type hints and mypy usage

Claude does NOT load `frontend/CLAUDE.md` or TypeScript rules - token-efficient and focused.

## References

- [How Claude Code works - Claude Code Docs](https://code.claude.com/docs/en/how-claude-code-works)
- [Using CLAUDE.MD files](https://claude.com/blog/using-claude-md-files)
- [The Complete Guide to CLAUDE.md](https://www.builder.io/blog/claude-md-guide)
- [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)
