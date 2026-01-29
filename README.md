# Claude Workflows

Reusable, opinionated workflow documentation for AI-assisted development with Claude.

## What This Is

A collection of workflow rules and patterns that define how you work with Claude across projects. Instead of re-explaining your preferences in every conversation, reference these files to establish consistent practices.

**Core workflows** apply to any project:
- TDD cycle (planning → RED → GREEN → REFACTOR)
- Git conventions (when to commit, message format)
- Documentation patterns (what to document, what not to)
- Claude Code tool usage (no plan mode, no explore agents, etc.)

**Stack-specific patterns** for Python, Rust, Go, and TypeScript:
- Tooling preferences
- Code style (functional-first, anti-patterns to avoid)
- Testing patterns

## Philosophy

**Minimal and focused.** These docs contain only what deviates from Claude's defaults or common practices. If Claude already knows it, we don't document it.

**Opinionated, not generic.** These are YOUR workflows codified. Fork and customize for your team.

## Repository Structure

```
claude-workflows/
├── core/                    # Universal workflows
│   ├── tdd-workflow.md
│   ├── claude-code-usage.md
│   ├── doc-patterns.md
│   └── quality-gates.md
├── stacks/                  # Language-specific patterns
│   ├── python/
│   ├── rust/
│   ├── go/
│   └── typescript/
└── templates/               # Starting points for projects
    ├── FEATURE_PLAN.md
    └── CLAUDE.md
```

## How to Use

**For monorepo projects,** see [guides/monorepo-setup.md](guides/monorepo-setup.md) for detailed setup instructions.

### Manual Setup (Current)

1. **Create `.claude/` in your project:**
   ```bash
   mkdir -p .claude/rules
   ```

2. **Copy core workflows:**
   ```bash
   cp ~/claude-workflows/core/*.md .claude/rules/
   ```

3. **Copy stack-specific files:**
   ```bash
   # For Python projects
   cp ~/claude-workflows/stacks/python/*.md .claude/rules/

   # For Rust projects
   cp ~/claude-workflows/stacks/rust/*.md .claude/rules/

   # etc...
   ```

4. **Create project CLAUDE.md:**
   ```bash
   cp ~/claude-workflows/templates/CLAUDE.md .claude/CLAUDE.md
   ```

   Then customize it with project-specific context.

5. **Reference in conversations:**
   Claude Code automatically reads `.claude/` directory files.

### Automated Setup (Future)

A `mis` plugin is planned to automate this:
```bash
mis run claude:init --stack python,typescript
mis run claude:sync  # Update rules from repo
```

## What's In Each Stack

### Python
- **Philosophy:** Modern, functional-first (avoid class-based encapsulation)
- **Tooling:** uv, pytest + ptw, ruff, mypy
- **Key patterns:** Parameterized tests, pure functions

### Rust
- **Philosophy:** Idiomatic Rust, let the compiler guide you
- **Tooling:** cargo, rustfmt, clippy, cargo-watch
- **Anti-patterns:** Overusing `.clone()` and `.unwrap()`

### Go
- **Philosophy:** Idiomatic Go, standard library first
- **Tooling:** go mod, gofmt, go test, air
- **Key patterns:** Table-driven tests, proper error handling

### TypeScript
- **Philosophy:** Functional-first (like Python), avoid `any`
- **Tooling:** pnpm, vitest, tsc
- **Anti-patterns:** Class-based encapsulation, using `any`

## Templates

**FEATURE_PLAN.md** - Template for planning features before implementation. Includes:
- Problem statement
- Proposed solution
- Integration points
- Success criteria
- Scope (in and out)

**CLAUDE.md** - Project-specific Claude instructions template with placeholders for:
- Project context
- Tech stack
- References to core/stack rules
- Project-specific patterns

## Maintenance

When you discover new patterns or anti-patterns:

1. Update the relevant file in `~/claude-workflows/`
2. Sync to existing projects (manually or via `mis claude:sync`)
3. One source of truth propagates everywhere

## Success Metrics

You'll know this is working when:
- Starting new projects takes minutes, not hours
- Claude follows your preferences without re-explaining
- Workflow improvements propagate across all projects
- Code quality is consistent across projects

## License

MIT - Fork and customize for your needs.
