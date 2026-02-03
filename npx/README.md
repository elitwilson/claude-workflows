# @elitwilson/claude-workflows

CLI tool to install and manage Claude workflow rules in your projects.

## Usage

```bash
npx @elitwilson/claude-workflows add
npx @elitwilson/claude-workflows upgrade
```

## Commands

### `add`

Interactively install workflow files from the repository.

```bash
npx @elitwilson/claude-workflows add [--dry-run]
```

- Choose between project (`.claude/`) or global (`~/.claude/`) scope
- Select from available core workflows and language stacks
- Files are installed to the `rules/` subdirectory

### `upgrade`

Update installed workflow files to their latest versions.

```bash
npx @elitwilson/claude-workflows upgrade [--force] [--dry-run]
```

- Updates both global and project workflows
- Skips locally modified files unless `--force` is used
- Use `--dry-run` to preview changes

## Requirements

Node.js >= 18.0.0
