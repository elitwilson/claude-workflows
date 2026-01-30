
# Feature: Make It So Plugin for Claude Workflows

**Status:** In Progress\
**Started:** 2026-01-30\
**Completed:** TBD

---

## Problem

Setting up Claude workflow rules in new projects is currently a manual process requiring multiple `cp` commands and knowledge of the repository structure. When workflow rules are updated, there's no automated way to sync changes to existing projects. This creates friction when starting new projects and makes it difficult to propagate improvements across all projects using these workflows.

---

## Proposed Solution

A `mis` plugin named `claude` that automates the setup and maintenance of Claude workflow files in projects. The plugin will:

- Fetch workflow files from the GitHub repository (https://github.com/elitwilson/claude-workflows)
- Set up the `.claude/` directory structure with an interactive UI for selecting core workflows and language stacks
- Track installed file versions and detect local modifications
- Support upgrading to latest workflow versions with conflict detection
- Allow adding additional workflows to existing setups

Users interact with the plugin via:
- `mis run claude:add` - Add workflow files (works for first-time setup and incremental additions)
- `mis run claude:upgrade` - Update to latest workflow versions

## Integration Points

_Existing code this feature touches_

- Creates new `make-it-so` plugin at `.makeitso/plugins/claude/`
- Follows plugin structure from existing plugins like `git-utils`
- Uses `make-it-so` plugin API (`mis-plugin-types.d.ts`, `mis-plugin-api.ts`)
- Creates `.claude/` directory structure in target projects
- Fetches files from GitHub raw content URLs

### Key Behaviors

- Fetches workflow files from GitHub `main` branch by default
- Creates `.claude/rules/` directory and copies selected workflow files
- Shows interactive UI for selecting workflows during add operations
- Detects local modifications by comparing checksums (computed on-demand, no metadata storage)
- Preserves user modifications during upgrades (with flags to override)
- Walks filesystem to discover installed files (no metadata file needed)

---

## Success Criteria

_How do we know this is working correctly and the problem is solved?_

- [x] `mis run claude:add` creates `.claude/` structure with user-selected core and stack files
- [x] `mis run claude:add` shows UI for selecting workflows and adds them
- [x] Works in monorepo scenarios (operates on current directory)
- [x] Supports `--dry-run` flag to preview changes
- [ ] `mis run claude:upgrade` detects newer versions and updates unmodified files
- [ ] Modified files are detected and skipped during upgrade (unless `--force` used)
- [ ] All workflow `.md` files include YAML frontmatter with version
- [ ] `upgrade` command compares versions from frontmatter to detect updates

---

## Scope

### In Scope

- `claude:add` command with interactive UI for adding workflows (first-time and incremental)
- `claude:upgrade` command with version tracking and conflict detection
- YAML frontmatter in all workflow `.md` files (version, updated date)
- Fetching from GitHub raw content URLs (default: main branch)
- Configuration options in `config.toml` for repo URL and branch
- Basic monorepo support (plugin operates in current working directory)
- Conflict detection via on-demand checksum comparison (no metadata file)
- Flags: `--force` (overwrite all), `--skip-modified` (preserve user edits), `--dry-run` (preview changes)

### Out of Scope

- `.claude/.metadata.json` tracking (decided against - filesystem walking is sufficient)
- CLAUDE.md template creation (skipped for MVP)
- Auto-populating CLAUDE.md template with detected project information (future enhancement)
- Interactive diff/merge UI for conflicts (future enhancement)
- Git submodule or bundled approach (we're fetching from remote)
- Advanced monorepo orchestration (bulk operations across packages)
- GitHub API integration for discovering latest tags/releases (just use main branch)
- Authentication for private repositories (public repo only for MVP)
- Offline-first bundled files (network required for add/upgrade)

---

## Important Considerations

_Edge cases, constraints, or gotchas to keep in mind_

- **Network dependency**: Plugin requires internet access for add/upgrade operations
- **Checksum strategy**: SHA-256 of entire file content (including frontmatter). Computed on-demand during upgrade.
- **Frontmatter parsing**: Parse version from YAML frontmatter to determine if update is needed
- **Modification detection**: Compare checksum of local file vs. checksum of same-version file fetched from GitHub
- **GitHub rate limits**: Using raw content URLs avoids most rate limiting, but should handle HTTP errors gracefully
- **Monorepo flexibility**: Users decide where to run `add` - plugin doesn't enforce structure
- **Version trust**: Assumes version numbers in frontmatter are properly maintained (file changes = version bump)
- **File permissions**: Created files use system defaults

---

## High-Level Todo

- [x] Create `mis` plugin scaffolding
- [x] Implement `manifest.toml` with commands and required permissions
- [x] Create `config.toml` with GitHub repo URL and default branch
- [x] Implement file fetching from GitHub raw URLs with error handling
- [x] Build interactive UI for workflow selection
- [x] Implement portable FileSystem abstraction (ready for npx port)
- [x] Implement directory creation and file writing with dry-run support
- [x] Implement `claude:add` command (works for first-time and incremental)
- [x] Test in single-repo projects
- [ ] Add YAML frontmatter to all existing workflow .md files in claude-workflows repo
- [ ] Implement filesystem walking to discover installed files
- [ ] Implement frontmatter parsing to extract versions
- [ ] Implement checksum calculation for modification detection
- [ ] Implement `claude:upgrade` command with conflict detection
- [ ] Test in monorepo scenarios (multiple .claude directories)
- [ ] Add documentation to plugin README
- [ ] Update claude-workflows README with plugin usage instructions

---

## Notes & Context

### 2026-01-30 - Initial Planning Discussion

Key decisions made:
- **Remote-first approach**: Fetch from GitHub rather than bundling files in plugin. Network access is acceptable trade-off for always having latest workflows.
- **Interactive UI**: `add` command uses interactive selection UI rather than command-line flags. Better UX for discovering available workflows.
- **Simple monorepo support**: Plugin operates in current directory. Users control where `.claude/` directories are created. No magic auto-detection.
- **Versioning via frontmatter**: Each .md file gets YAML frontmatter with version and date.
- **Default to main branch**: Always fetch latest from main rather than pinned versions or git tags. Keep it simple for MVP.
- **Merged init+add**: Single `add` command handles both first-time setup and incremental additions. No need for separate `init`.
- **No metadata file**: Skip `.metadata.json`. Walk filesystem to discover files, parse frontmatter for versions, compute checksums on-demand.

### 2026-01-30 - Implementation Session 1

Completed TDD implementation of core file operations:
- **Portable architecture**: `FileSystem` interface abstracts I/O operations (Deno adapter implemented, Node.js ready)
- **File installation**: `ensureDirectory()` and `writeWorkflowFile()` with full test coverage
- **Dry-run support**: All operations log intended actions without executing in dry-run mode
- **`claude:add` command**: Fully functional - discovers workflows, presents UI, installs files
- **Testing**: 7 unit tests passing, manual testing successful

Architecture decision rationale:
- FileSystem abstraction enables easy npx/Node.js port later
- No metadata storage simplifies implementation and reduces maintenance
- Trust version numbers in frontmatter (enforced by workflow process)
- Compute checksums on-demand only during upgrade (not at install time)

### File Structure

Plugin creates:
```
.claude/
└── rules/
    ├── tdd-workflow.md     # Core workflows
    ├── claude-code-usage.md
    ├── doc-patterns.md
    ├── quality-gates.md
    └── [stack-specific].md # e.g., python/code-style.md
```

YAML frontmatter format (in each workflow file):
```yaml
---
version: 0.1.0
updated: 2026-01-30
---
```

### Upgrade Detection Logic

How `upgrade` determines what to update:

1. **Discover installed files**: Walk `.claude/rules/` directory
2. **Parse versions**: Extract version from frontmatter of each local file
3. **Fetch latest from GitHub**: Download same file from main branch
4. **Compare versions**: Check if remote version > local version
5. **Detect modifications** (if versions match):
   - Fetch the file at local version from GitHub
   - Calculate checksum of fetched file
   - Calculate checksum of local file
   - If checksums differ → user modified it
6. **Apply updates**:
   - Update if: remote version > local version AND (not modified OR `--force`)
   - Skip if: user modified AND not `--force`
   - Report skipped files

### Future Enhancements (Post-MVP)

- Auto-detect project tech stack and suggest relevant workflows
- Auto-populate CLAUDE.md template with project context
- Interactive diff UI for merge conflicts
- Support for version pinning and git tags
- Bulk operations for monorepos (init/upgrade all packages)
- Support for private repositories with authentication
- Plugin registry for sharing custom workflow collections

---

## Reference

_Links to related work, examples, or documentation_

- Claude Workflows Repository: https://github.com/elitwilson/claude-workflows
- Make It So CLI: https://github.com/elitwilson/make-it-so
- Example plugin structure: `.makeitso/plugins/git-utils/` in make-it-so-cli repo
- GitHub Raw Content API: `https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}`
