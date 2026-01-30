
# Feature: Make It So Plugin for Claude Workflows

**Status:** Planning\
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
- `mis run claude:init` - Initial setup with interactive stack selection
- `mis run claude:upgrade` - Update to latest workflow versions
- `mis run claude:add` - Add additional workflows via interactive UI

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
- Creates `.claude/CLAUDE.md` from template
- Tracks installed files in `.claude/.metadata.json` with versions and checksums
- Detects local modifications via checksum comparison
- Shows interactive UI for selecting workflows during init and add operations
- Preserves user modifications during upgrades (with flags to override)

---

## Success Criteria

_How do we know this is working correctly and the problem is solved?_

- [ ] `mis run claude:init` creates `.claude/` structure with user-selected core and stack files
- [ ] `mis run claude:upgrade` detects newer versions and updates unmodified files
- [ ] `mis run claude:add` shows UI for selecting additional workflows and adds them
- [ ] Modified files are detected and skipped during upgrade (unless `--force` used)
- [ ] All workflow `.md` files include YAML frontmatter with version and checksum
- [ ] `.claude/.metadata.json` accurately tracks installed file state
- [ ] Works in monorepo scenarios (operates on current directory)
- [ ] Plugin works offline once files are cached/installed

---

## Scope

### In Scope

- `claude:init` command with interactive stack/workflow selection UI
- `claude:upgrade` command with version tracking and conflict detection
- `claude:add` command with interactive UI for adding workflows
- YAML frontmatter in all workflow `.md` files (version, updated date, checksum)
- `.claude/.metadata.json` for tracking installed files and modifications
- Fetching from GitHub raw content URLs (default: main branch)
- Configuration options in `config.toml` for repo URL and branch
- Basic monorepo support (plugin operates in current working directory)
- Conflict detection via checksum comparison
- Flags: `--force` (overwrite all), `--skip-modified` (preserve user edits), `--dry-run` (preview changes)

### Out of Scope

- Auto-populating CLAUDE.md template with detected project information (future enhancement)
- Interactive diff/merge UI for conflicts (future enhancement)
- Git submodule or bundled approach (we're fetching from remote)
- Advanced monorepo orchestration (bulk operations across packages)
- GitHub API integration for discovering latest tags/releases (just use main branch)
- Authentication for private repositories (public repo only for MVP)
- Offline-first bundled files (network required for init/upgrade)

---

## Important Considerations

_Edge cases, constraints, or gotchas to keep in mind_

- **Network dependency**: Plugin requires internet access for init/upgrade operations
- **Checksum strategy**: Need consistent checksum algorithm (probably SHA-256 of file content excluding frontmatter)
- **Frontmatter parsing**: Must strip YAML frontmatter before calculating checksums to avoid false positives
- **GitHub rate limits**: Using raw content URLs avoids most rate limiting, but should handle HTTP errors gracefully
- **Monorepo flexibility**: Users decide where to run `init` - plugin doesn't enforce structure
- **Concurrent updates**: If workflows repo changes frequently, may want to add version pinning option in future
- **File permissions**: Ensure created files are writable by user for future modifications

---

## High-Level Todo

- [ ] Add YAML frontmatter to all existing workflow .md files in claude-workflows repo
- [ ] Create `mis` plugin scaffolding (`mis create claude` in make-it-so-cli)
- [ ] Implement `manifest.toml` with three commands and required permissions
- [ ] Create `config.toml` with GitHub repo URL and default branch
- [ ] Implement file fetching from GitHub raw URLs with error handling
- [ ] Build interactive UI for workflow selection (for both init and add)
- [ ] Implement `.claude/.metadata.json` creation and management
- [ ] Implement checksum calculation and comparison logic
- [ ] Implement `claude:init` command
- [ ] Implement `claude:upgrade` command with conflict detection
- [ ] Implement `claude:add` command
- [ ] Test in single-repo projects
- [ ] Test in monorepo scenarios (multiple .claude directories)
- [ ] Add documentation to plugin README
- [ ] Update claude-workflows README with plugin usage instructions

---

## Notes & Context

### 2026-01-30 - Initial Planning Discussion

Key decisions made:
- **Remote-first approach**: Fetch from GitHub rather than bundling files in plugin. Network access is acceptable trade-off for always having latest workflows.
- **Interactive UI**: Both `init` and `add` commands will use interactive selection UI rather than command-line flags. Better UX for discovering available workflows.
- **Simple monorepo support**: Plugin operates in current directory. Users control where `.claude/` directories are created. No magic auto-detection.
- **Versioning via frontmatter**: Each .md file gets YAML frontmatter with version, date, and checksum. `.metadata.json` tracks installation state.
- **Default to main branch**: Always fetch latest from main rather than pinned versions or git tags. Keep it simple for MVP.

### File Structure

Plugin creates:
```
.claude/
├── .metadata.json          # Tracks installed files and versions
├── CLAUDE.md               # Project-specific instructions (from template)
└── rules/
    ├── tdd-workflow.md     # Core workflows
    ├── claude-code-usage.md
    ├── doc-patterns.md
    ├── quality-gates.md
    └── [stack-specific].md # e.g., python/code-style.md
```

Metadata format:
```json
{
  "installed_at": "2026-01-30T10:00:00Z",
  "source_repo": "https://github.com/elitwilson/claude-workflows",
  "source_branch": "main",
  "files": {
    "rules/tdd-workflow.md": {
      "version": "0.1.0",
      "checksum": "abc123...",
      "modified": false,
      "installed_at": "2026-01-30T10:00:00Z"
    }
  }
}
```

YAML frontmatter format:
```yaml
---
version: 0.1.0
updated: 2026-01-30
---
```

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
