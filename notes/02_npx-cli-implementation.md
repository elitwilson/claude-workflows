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

## Integration Points

### Shared Core Library
The existing business logic from `.makeitso/plugins/claude/` will be extracted into shared modules:
- `lib.ts` - Core utilities (frontmatter parsing, checksums, file operations)
- `metadata.ts` - Metadata management
- `discovery.ts` - GitHub API discovery

### New Components
- **Node.js FileSystem adapter** (`node-fs.ts`) - Implements FileSystem interface using Node's fs module
- **CLI entry point** - Argument parsing and command routing
- **Node.js prompts** - Interactive UI using Node-compatible library (replace Cliffy)

### Relationship to MIS Plugin
- Both distributions share the same core business logic
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
- Extract shared core logic into reusable modules
- Create Node.js FileSystem adapter
- Build CLI with commander/yargs for argument parsing
- Implement interactive prompts with inquirer/prompts
- Support `add` and `upgrade` commands
- Support `--force` and `--dry-run` flags
- Bundle and publish to npm
- Basic documentation in README

### Out of Scope (Future)
- Configuration file support (just use hardcoded defaults for now)
- Advanced monorepo orchestration
- CI/CD integration examples
- Comprehensive cross-platform testing
- Migration from MIS plugin to CLI (they're interoperable)

---

## Important Considerations

### Code Organization (Deferred Decision)
For now, keep everything in current locations. Structure can be reorganized later into proper monorepo if needed. Priority is getting it working.

### Packaging
- Package name: `@elitwilson/claude-workflows` (or similar with unique username prefix)
- Bundler: **Vite?** (need to investigate if appropriate for CLI bundling)
- Alternative: esbuild, rollup, or just tsc

### Testing Strategy
- Keep existing Deno tests for now
- Run them as-is during development
- Future: consider cross-runtime test framework if maintenance becomes burdensome

### Configuration
- Implementation detail to figure out during development
- Options: CLI flags only, env vars, config file, or combination
- Default to same values as MIS plugin (`elitwilson/claude-workflows`)

### Versioning
- Future problem - defer until we have both working
- Likely: version CLI independently from MIS plugin, but keep core logic versioned separately

---

## High-Level Todo

- [ ] Research: Can Vite bundle Node CLI applications?
- [ ] Extract core logic to shared location (or leave in place with dual imports)
- [ ] Create `node-fs.ts` FileSystem adapter
- [ ] Choose and integrate argument parser (commander vs yargs)
- [ ] Choose and integrate prompt library (inquirer vs prompts vs similar)
- [ ] Create CLI entry point with command routing
- [ ] Implement `add` command wrapper
- [ ] Implement `upgrade` command wrapper
- [ ] Set up package.json with proper bin configuration
- [ ] Bundle/build process
- [ ] Test locally with `npm link` or similar
- [ ] Publish to npm
- [ ] Update main README with npx instructions

---

## Technical Decisions

### Runtime Compatibility
**Decision:** Use Deno for tests, Node for CLI runtime
**Rationale:** Existing tests work, no reason to convert. CLI needs broad compatibility (Node is everywhere).

### Shared Code Strategy
**Decision:** Keep code where it is for now, import from both contexts
**Rationale:** Avoid premature reorganization. Can refactor to monorepo structure later if needed.

### Bundle Strategy
**Decision:** TBD - Investigate Vite for CLI bundling
**Fallback:** esbuild or rollup if Vite isn't suitable

### Prompt Library
**Decision:** TBD during implementation
**Options:** inquirer (popular), prompts (lightweight), enquirer (Cliffy-like)

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

- Existing MIS plugin: `.makeitso/plugins/claude/`
- Core workflows repo: https://github.com/elitwilson/claude-workflows
- Related feature: [01_make-it-so-plugin-plan.md](./make-it-so-plugin-plan.md)
