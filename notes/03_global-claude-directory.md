
# Feature: Global .claude Directory Support

**Status:** Implemented (pending: duplicate detection wired in add, manual testing)\
**Started:** 2026-01-31

---

## Problem

Currently, the `mis` plugin only supports installing Claude workflow files to project-specific `.claude/` directories. Users must reinstall workflows for each new project. There's no way to maintain a global set of workflow files that apply across all projects.

According to Claude's documentation, there are multiple scopes for configuration:
- **User scope**: `~/.claude/` - affects you across all projects
- **Project scope**: `.claude/` in repository - affects all collaborators

The plugin should support both scopes to give users flexibility in how they organize their workflows.

---

## Proposed Solution

Extend the `mis` plugin to support installing workflow files to either:
1. **Project scope**: `./.claude/rules/` (current behavior)
2. **Global scope**: `~/.claude/rules/` (new)

Users will choose the installation scope via an interactive prompt at the beginning of the `add` command flow. The `upgrade` command will automatically upgrade files in both locations.

### User Flow

**Add command:**
1. User runs `mis run claude:add`
2. Plugin prompts: "Install to: ( ) Project (•) Global" (radio selection)
3. Plugin shows workflow selection UI (existing checkboxes for core + stacks)
4. Plugin installs files to chosen location
5. Plugin updates metadata file in the appropriate location

**Upgrade command:**
1. User runs `mis run claude:upgrade`
2. Plugin discovers and upgrades files in `~/.claude/rules/` (if exists)
3. Plugin discovers and upgrades files in `./.claude/rules/` (if exists)
4. Plugin shows separate summary for global and project upgrades

---

## Integration Points

_Existing code this feature touches_

- **add.ts**: Add scope selection prompt before workflow selection
- **upgrade.ts**: Check both global and project directories
- **metadata.ts**: No changes needed (already abstracted to work with any directory)
- **lib.ts**: Directory resolution utilities may need to detect home directory

### Key Behaviors

- **Scope selection**: Interactive radio button prompt (using cliffy) before workflow selection
- **Global directory path**: `~/.claude/` (follows standard CLI conventions like `~/.vim`, `~/.config`)
- **Separate metadata files**:
  - `~/.claude/.metadata.json` for global files
  - `./.claude/.metadata.json` for project files
- **Duplicate detection**: Warn and skip if attempting to install a file that already exists in the target scope
- **Upgrade both scopes**: `upgrade` command processes both directories independently
- **No flags needed**: Rely entirely on interactive prompt for scope selection (keep it simple for MVP)

---

## Success Criteria

_How do we know this is working correctly and the problem is solved?_

- [x] `mis run claude:add` prompts user to choose between "Project" and "Global" scope
- [x] Choosing "Global" installs files to `~/.claude/rules/` regardless of current directory
- [x] Choosing "Project" installs files to `./.claude/rules/` (existing behavior)
- [x] Global installations create and update `~/.claude/.metadata.json`
- [x] Project installations create and update `./.claude/.metadata.json`
- [x] `mis run claude:upgrade` upgrades both global and project files automatically
- [x] Upgrade command shows separate summaries for global vs project upgrades
- [ ] Attempting to install a duplicate file in same scope shows warning and skips
- [ ] Works across different projects (global files accessible everywhere — needs manual verification)

---

## Scope

### In Scope

- Interactive scope selection (radio: "Project" or "Global") at start of `add` command
- Installing workflow files to `~/.claude/rules/`
- Separate metadata files for global (`~/.claude/.metadata.json`) and project (`./.claude/.metadata.json`)
- Upgrade command processes both directories automatically
- Duplicate detection within same scope (warn and skip)
- Separate upgrade reporting for global vs project files
- Home directory resolution (~/ expansion)

### Out of Scope

- CLI flags like `--global` or `--local` (use interactive prompt only for MVP)
- Merging or syncing between global and project scopes
- Preventing duplicates across scopes (user can have same file in both - this is valid)
- Scope priority or override logic (not needed - they're independent)
- Migration tool to move files between scopes
- Bulk operations (e.g., "copy all global to project")
- Platform-specific paths (Windows %APPDATA%, XDG dirs) - just use `~/.claude/` everywhere
- Interactive confirmation when installing globally
- Config option to set default scope

---

## Important Considerations

_Edge cases, constraints, or gotchas to keep in mind_

- **Home directory resolution**: Need reliable `~` expansion on all platforms (Mac, Linux, Windows)
- **Duplicate files across scopes**: Valid use case (e.g., global tdd-workflow.md + project-specific tdd-workflow.md). Plugin should NOT prevent this.
- **Duplicate files within scope**: Edge case that shouldn't happen often. Detect, warn, and skip.
- **Global metadata location**: `~/.claude/.metadata.json` (parallel to project metadata)
- **Directory creation**: Must create `~/.claude/rules/` on first global install
- **Current directory irrelevant for global**: When installing globally, ignore project context completely
- **Upgrade independence**: Global and project upgrades are completely independent operations
- **No scope migration**: If user wants to move a file from global to project, they must reinstall it
- **Permission issues**: Global directory may have permission issues on some systems (acceptable for MVP)

---

## High-Level Implementation Plan

### Phase 1: Home Directory Resolution
- [x] Add utility function to resolve home directory path (`~/` expansion)
- [x] Add tests for home directory resolution
- [x] Add utility to determine target directory based on scope choice

### Phase 2: Scope Selection UI
- [x] Add cliffy radio button prompt for scope selection
- [x] Prompt appears first, before workflow selection
- [x] Options: "Project (.claude/)" and "Global (~/.claude/)"
- [x] Store selected scope for use in installation

### Phase 3: Add Command Updates
- [x] Update `add.ts` to accept scope parameter
- [x] Route to appropriate directory based on scope
- [x] Update metadata in correct location (global vs project)
- [ ] Add duplicate detection within scope (warn and skip) — `checkDuplicateFile` exists in lib.ts but is not called in the add loop yet
- [x] Test global installation flow
- [x] Test project installation flow (ensure still works)

### Phase 4: Upgrade Command Updates
- [x] Update `upgrade.ts` to check both directories
- [x] Load metadata from both locations
- [x] Process global directory if exists
- [x] Process project directory if exists
- [x] Show separate summaries for each scope
- [x] Test upgrade with only global files
- [x] Test upgrade with only project files
- [x] Test upgrade with both global and project files

### Phase 5: Integration Testing
- [x] Test full flow: global add → global upgrade
- [x] Test full flow: project add → project upgrade
- [x] Test mixed scenario: global + project files in same user environment
- [x] Test duplicate detection (same file in same scope)
- [x] Test that duplicates across scopes are allowed
- [ ] Manual testing across multiple projects

---

## Notes & Context

### 2026-01-31 - Initial Planning Discussion

Key decisions made:
- **Interactive-only scope selection**: No CLI flags for MVP. Use radio button prompt at start of `add` flow.
- **Upgrade both automatically**: No need for separate commands or flags. `upgrade` just checks both locations.
- **Separate metadata files**: `~/.claude/.metadata.json` and `./.claude/.metadata.json` are independent.
- **Simple duplicate handling**: Warn and skip if installing duplicate within same scope. Allow duplicates across scopes.
- **Standard path convention**: Use `~/.claude/` everywhere (no platform-specific logic for MVP).
- **No scope migration**: Keep it simple - users must reinstall to move files between scopes.

### Claude Scope Documentation Reference

From Claude docs:
```
Scope      Location                           Who it affects                      Shared with team?
User       ~/.claude/ directory               You, across all projects            No
Project    .claude/ in repository             All collaborators on repository     Yes (committed to git)
```

This feature implements support for the "User" scope.

---

## Implementation Progress

### 2026-01-31 - Phase 1 Complete

**What was done:**
- Implemented `resolveHomePath(path: string, homeDir: string): string`
  - Expands ~ to home directory
  - Handles ~/path format
  - Returns absolute paths unchanged
- Implemented `getTargetDirectory(scope: Scope, projectRoot: string, homeDir: string): string`
  - Returns {projectRoot}/.claude for project scope
  - Returns {homeDir}/.claude for global scope
- Added comprehensive tests (7 passing tests)
- Commit: `feat: implement home directory resolution utilities`

**Pattern established:**
- Pure functions in lib.ts (no Deno-specific APIs)
- HomeDir passed as parameter from entry points
- Ready for Node.js port when needed

### 2026-01-31 - Phases 2–5 Implemented

**What was done:**

Phase 2 — Scope Selection UI:
- Added `Select.prompt<Scope>()` (cliffy radio) as the first prompt in `add.ts`
- Options: "Project (.claude/)" and "Global (~/.claude/)", defaulting to project
- Selected scope flows through to `getTargetDirectory()` for all subsequent operations

Phase 3 — Add Command:
- `add.ts` routes installation to the correct directory based on scope
- Metadata is written to the scope-appropriate `.claude/.metadata.json`
- `checkDuplicateFile()` utility added to `lib.ts` and tested, but **not yet wired into the add loop** — files will currently overwrite silently

Phase 4 — Upgrade Command:
- Added `upgradeAll()` which runs `performUpgrade()` for both global and project scopes via `Promise.all()`
- Entry point (`import.meta.main`) prints separate "🌐 Global" and "📁 Project" summary sections
- Gracefully handles missing directories (returns empty result, no crash)

Phase 5 — Integration Tests:
- `scope-selection.test.ts`: `getHomeDir` error handling, scope routing, duplicate detection within/across scopes
- `global-scope-integration.test.ts`: End-to-end flows using real temp directories — global add/upgrade, project add/upgrade, mixed scenario, same file in both scopes
- `upgrade.test.ts`: Added "Phase 4" describe block — both-scope upgrades, missing global directory, `upgradeAll` return shape

Other:
- `manifest.toml` permissions updated: `file_read` and `file_write` now include `$HOME/.claude`
- `deno-fs.ts` exports `getHomeDir()` for use by both `add.ts` and `upgrade.ts`

**Remaining work:**
- Wire `checkDuplicateFile` into the `add.ts` installation loop (warn and skip)
- Manual testing across multiple projects

---

## Questions to Resolve

- [ ] Should we show the resolved path in the prompt? e.g., "Global (~/.claude/ → /Users/username/.claude/)"
- [ ] Should upgrade command fail gracefully if global directory doesn't exist? (yes, just skip it)
- [ ] Do we need a way to list installed files by scope? (future enhancement)

---

## Reference

_Links to related work, examples, or documentation_

- Claude Documentation: Scope levels (User vs Project)
- Existing metadata implementation: `.makeitso/plugins/claude/metadata.ts`
- Cliffy documentation: https://cliffy.io/ (for radio prompts)
