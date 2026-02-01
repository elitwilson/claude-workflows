# Feature: NPX CLI Implementation for Claude Workflows

**Status:** Planning\
**Started:** 2026-01-30\
**Completed:** TBD

---

## Problem

The current workflow management tool requires users to install and use Make It So (`mis`). This creates an adoption barrier for users who:
- Don't use Make It So
- Want a standalone CLI tool
- Prefer npx for zero-install convenience
- Need to use the tool in environments where Deno isn't available/preferred

---

## Proposed Solution

Create an npx-compatible CLI that provides the same functionality as the `mis` plugin but as a standalone Node.js tool. The implementation will reuse the existing business logic through a shared core library.

Users will be able to run:
```bash
npx @elitwilson/claude-workflows add
npx @elitwilson/claude-workflows upgrade
```

---

## Project Structure

```
claude-workflows/
├── plugins/claude/          # Shared source of truth
│   ├── lib.ts               # Core utilities (imported by both)
│   ├── discovery.ts         # GitHub API discovery (imported by both)
│   ├── metadata.ts          # Metadata management (imported by both)
│   ├── deno-fs.ts           # Deno FileSystem adapter (MIS only)
│   ├── add.ts               # MIS add command entry point
│   ├── upgrade.ts           # MIS upgrade command entry point
│   └── *.test.ts            # Deno tests for shared logic
│
├── npx/                     # NPX CLI package
│   ├── src/
│   │   ├── cli.ts           # Entry point + commander setup
│   │   ├── node-fs.ts       # Node FileSystem adapter
│   │   └── commands/
│   │       ├── add.ts       # Add command (uses inquirer)
│   │       └── upgrade.ts   # Upgrade command
│   ├── tests/               # Node tests (mirrors MIS test coverage)
│   ├── package.json
│   ├── tsconfig.json
│   └── tsup.config.ts
```

---

## Integration Points

### Shared Core Library
The existing business logic in `plugins/claude/` is imported directly by both runtimes:
- `lib.ts` - Core utilities (frontmatter parsing, checksums, file operations)
- `metadata.ts` - Metadata management
- `discovery.ts` - GitHub API discovery

### New Components (npx/)
- **Node.js FileSystem adapter** (`node-fs.ts`) - Implements FileSystem interface using Node's fs module
- **CLI entry point** (`cli.ts`) - Commander-based argument parsing and command routing
- **Node.js prompts** - Interactive UI using inquirer (replaces Cliffy)

### Relationship to MIS Plugin
- Both distributions import the same shared modules from `plugins/claude/`
- MIS plugin uses `deno-fs.ts`, CLI uses `node-fs.ts`
- Both target the same `.claude/` directory structure and metadata format
- Files installed by one can be upgraded by the other

---

## Success Criteria

- [ ] `npx @elitwilson/claude-workflows add` works with interactive UI
- [ ] `npx @elitwilson/claude-workflows upgrade` works with version detection
- [ ] All flags (`--force`, `--dry-run`) work as expected
- [ ] Metadata created by CLI is compatible with MIS plugin and vice versa
- [ ] Published to npm and installable via npx
- [ ] Zero runtime dependencies on Deno or Make It So

---

## Scope

### In Scope (MVP)
- Create Node.js FileSystem adapter
- Build CLI with commander for argument parsing
- Implement interactive prompts with inquirer
- Support `add` and `upgrade` commands
- Support `--force` and `--dry-run` flags
- Tests mirroring MIS plugin coverage
- Bundle with tsup and publish to npm
- Basic documentation in README

### Out of Scope (Future)
- Configuration file support (just use hardcoded defaults for now)
- Advanced monorepo orchestration
- CI/CD integration examples
- Comprehensive cross-platform testing
- Migration from MIS plugin to CLI (they're interoperable)

---

## Important Considerations

### Code Organization
- Shared logic stays in `plugins/claude/`
- NPX CLI lives in `npx/` directory
- Imports shared code directly: `import { ... } from "../plugins/claude/lib.ts"`
- tsup bundles everything into single distributable

### Packaging
- Package name: `@elitwilson/claude-workflows`
- Bundler: **tsup** (esbuild wrapper, standard for modern CLIs)
- Single bundled output for fast npx execution

### Testing Strategy
- Shared logic (`plugins/claude/*.ts`) tested by existing Deno tests
- NPX CLI layer (`npx/`) gets Node tests that mirror MIS plugin test coverage
- Trust Deno tests for shared logic validation

### Configuration
- Hardcode defaults: `elitwilson/claude-workflows`, `main` branch
- CLI flags for `--force`, `--dry-run`
- No config file for MVP

### Versioning
- Future problem - defer until we have both working
- Likely: version CLI independently from MIS plugin, but keep core logic versioned separately

---

## High-Level Todo

- [ ] Scaffold `npx/` directory (package.json, tsconfig, tsup.config.ts)
- [ ] Create `node-fs.ts` FileSystem adapter
- [ ] Create CLI entry point with commander
- [ ] Implement `add` command with inquirer prompts
- [ ] Implement `upgrade` command
- [ ] Write tests mirroring MIS plugin coverage
- [ ] Test locally with `npm link`
- [ ] Publish to npm
- [ ] Update main README with npx instructions

---

## Technical Decisions

### Runtime Compatibility
**Decision:** Deno tests for shared logic, Node for CLI runtime
**Rationale:** Existing Deno tests validate shared logic. CLI targets Node for broad compatibility.

### Shared Code Strategy
**Decision:** Import directly from `plugins/claude/` into `npx/src/`
**Rationale:** Single source of truth. tsup bundles everything together.

### Bundle Strategy
**Decision:** tsup (esbuild wrapper)
**Rationale:** Standard for modern Node CLIs. Fast, minimal config, handles TypeScript natively.

### Prompt Library
**Decision:** inquirer
**Rationale:** Most popular, well-maintained, familiar API similar to Cliffy.

---

## Notes & Context

### Why NPX?
- Zero-install convenience (`npx` runs without `npm install -g`)
- Broader reach (Node ecosystem is larger than Deno)
- Easier CI/CD integration
- Familiar to most JavaScript developers

### Architecture Benefits
The FileSystem abstraction pattern we used for the MIS plugin makes this port straightforward:
- Business logic is already platform-agnostic
- Just need to swap filesystem adapter
- Prompts and CLI wrapper are the only new pieces

### Compatibility
Files installed or upgraded by either tool (MIS plugin or npx CLI) should work with the other. Both:
- Use the same `.claude/` directory structure
- Read/write the same `.metadata.json` format
- Track files the same way
- Use the same GitHub repository structure

---

## Reference

- Shared plugin code: `plugins/claude/`
- Core workflows repo: https://github.com/elitwilson/claude-workflows
- Related feature: [01_make-it-so-plugin-plan.md](./make-it-so-plugin-plan.md)
