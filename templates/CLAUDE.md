---
version: 0.1.0
updated: 2026-01-30
---

# {{PROJECT_NAME}} - Claude Instructions

<!--
This file contains project-specific Claude instructions.
It references core workflows from the claude-workflows repository.
-->

## Project Context

<!--
Add 2-4 sentences about what this project does and its purpose.
Example:
This is a FastAPI service that generates financial reports from transaction data.
It integrates with PostgreSQL and exports to PDF/Excel formats.
-->

**Tech Stack:** {{STACK}}
**Key Dependencies:** {{KEY_DEPENDENCIES}}

---

## Core Workflows

This project follows standardized development workflows:

- **TDD Workflow:** See `.claude/rules/tdd-workflow.md`
- **Git Workflow:** See `.claude/rules/git-workflow.md`
- **Documentation Patterns:** See `.claude/rules/doc-patterns.md`
- **Claude Code Usage:** See `.claude/rules/claude-code-usage.md`

<!--
These files should be copied from the claude-workflows repository:
- From: ~/claude-workflows/core/*.md
- To: .claude/rules/*.md

Or installed via: mis claude:init --stack {{STACK}}
-->

---

## Stack-Specific Rules

<!--
Reference stack-specific patterns from claude-workflows repository.
These should be copied to .claude/rules/

For Python projects:
- See `.claude/rules/python-testing.md`
- See `.claude/rules/python-code-style.md`
-->

---

## Project-Specific Patterns

<!--
Document any project-specific patterns, conventions, or constraints that
deviate from or extend the standard workflows.

Examples:
- Specific API patterns unique to this project
- Custom abstractions or frameworks in use
- Integration points with external systems
- Known limitations or gotchas
-->

### Architecture

<!-- Add architectural decisions and patterns specific to this project -->

### Testing

<!-- Add any project-specific testing patterns beyond standard Python/stack conventions -->

### Dependencies

<!-- Document important third-party integrations or special dependency considerations -->

---

## Quick Reference

**Run tests:** `{{TEST_COMMAND}}`
**Run linter:** `{{LINT_COMMAND}}`
**Run type check:** `{{TYPE_CHECK_COMMAND}}`

<!-- Update these commands based on your project's tooling -->
