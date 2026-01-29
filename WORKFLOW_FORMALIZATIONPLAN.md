# Claude Workflows Formalization Plan

## Goal
Create a reusable system for AI-assisted development workflows that is:
- **Repeatable** - Same process every time
- **Transferable** - Team can adopt it
- **Improvable** - Can iterate systematically
- **Maintainable** - Single source of truth

## The Problem We're Solving
- Your TDD workflow works great, but it's implicit knowledge
- CLAUDE.md exists but reliability is inconsistent
- No way to share workflows across projects or with teammates
- Hard to improve workflows systematically
- Starting new projects means reinventing the wheel

## The Solution
Create `claude-workflows` repository containing:
- **Core rules** - Universal workflows (TDD, git, documentation)
- **Stack-specific rules** - Ecosystem patterns (FastAPI, Go, React)
- **Templates** - Starting points for projects
- **mis plugin** - Automate setup/sync (future)

## Repository Structure

```
claude-workflows/
├── README.md
├── core/
│   ├── tdd-workflow.md
│   ├── git-workflow.md
│   ├── doc-patterns.md
│   └── quality-gates.md
├── stacks/
│   ├── fastapi/
│   │   ├── README.md
│   │   ├── testing.md
│   │   ├── code-style.md
│   │   └── examples/
│   ├── go/
│   │   └── ...
│   └── react/
│       └── ...
├── templates/
│   ├── CLAUDE.md.template
│   └── FEATURE_PLAN.md
└── plugin/
    └── mis-claude/
        └── (mis plugin code - future)
```

## What Goes Where

### `core/` - Universal Rules
Rules that apply to ANY project regardless of language/framework:
- TDD workflow (planning → RED → GREEN → REFACTOR)
- Git conventions (branches, commits, what happens when)
- Documentation patterns (what to document, what not to)
- Quality gates (standards before phase transitions)

### `stacks/[name]/` - Ecosystem-Specific Rules
Reusable patterns for specific tech stacks:
- Testing conventions for that ecosystem
- Code style and project structure
- Framework-specific patterns
- Common pitfalls and solutions

### `templates/` - Starting Points
- `CLAUDE.md.template` - Project-specific file with placeholders
- `FEATURE_PLAN.md` - Your existing feature plan template
- Any other reusable templates

### `plugin/` - Automation (Future)
- `mis` plugin for initializing projects
- Syncing updated rules
- Validation tools

## Phase 1: Build the Foundation

### Tasks
1. **Create repository structure**
   - Initialize git repo
   - Create directory structure
   - Add .gitignore

2. **Write core workflows**
   - Extract TDD workflow from current CLAUDE.md
   - Document git workflow (explicit branches, commits)
   - Define documentation patterns (what's worth capturing)
   - Create quality gates checklist

3. **Create first stack (choose one)**
   - Start with most familiar stack (probably FastAPI?)
   - Extract testing patterns
   - Document code style conventions
   - Add one example feature showing full cycle

4. **Build templates**
   - Generalize current FEATURE_PLAN.md
   - Create CLAUDE.md.template with placeholders
   - Add usage instructions

### Deliverables
- Functional `claude-workflows` repo
- Complete core rules
- One complete stack template
- README explaining how to use it

### How to Use (Manual Process)
Until plugin is built, manual process:
1. Create `.claude/rules/` in your project
2. Copy files from `core/` to `.claude/rules/`
3. Copy files from `stacks/[name]/` to `.claude/rules/`
4. Copy and customize `CLAUDE.md.template` to `.claude/CLAUDE.md`

## Phase 2: Validate & Iterate

### Tasks
1. **Use it on real work**
   - Apply to next feature in current project
   - Or start new project using the templates
   - Track what works, what doesn't

2. **Refine based on usage**
   - What's missing from core rules?
   - What's ambiguous in workflows?
   - What does Claude ignore or misunderstand?

3. **Document anti-patterns**
   - When does AI test stupid things?
   - When does TDD fail?
   - What makes plans ambiguous?

### Deliverables
- Updated rules based on real usage
- Anti-patterns documented
- Confidence the workflows actually work

## Phase 3: Expand & Automate

### Tasks
1. **Add more stacks** (as needed)
   - Go, React, or whatever you work with
   - Follow same pattern as first stack

2. **Build mis plugin**
   - `mis claude init --stack [name]` - Bootstrap new project
   - `mis claude sync` - Update rules from repo
   - `mis claude validate` - Check rules are valid

3. **Team rollout** (if applicable)
   - Document for teammates
   - Help them adopt
   - Gather feedback

### Deliverables
- Multiple stack templates
- Working mis plugin
- Team adoption (if applicable)

## Key Principles

### What to Document
- **Decisions** - Why you chose X over Y
- **Workflows** - The process, not the code
- **Constraints** - What must be true
- **Anti-patterns** - What NOT to do

### What NOT to Document
- Obvious code explanations
- Generic "how to use X" tutorials
- Anything AI can infer from code
- Anything that becomes stale quickly

### Ownership Philosophy
- **Planning phase** = Where architectural decisions happen
- **TDD phase** = Executing the plan
- Ownership lives in planning, execution can be more autonomous

## Open Questions

### Technical
- Which stacks to prioritize?
- How often to sync rules across projects?
- Should rules be in separate git repos or monorepo?

### Workflow
- QA subagents - worth experimenting with or drop it?
- Custom Claude skills - useful here?
- How to measure if workflows are improving?

### Team
- How prescriptive vs flexible should this be?
- What's universal vs personal preference?
- How to handle team members with different styles?

## Success Metrics

You'll know this is working when:
- Starting new projects takes minutes, not hours
- Teammates can follow your workflow without asking questions
- You can improve workflows in one place and it propagates everywhere
- Code quality is consistent across projects
- Less time explaining "how we do things" to AI

## Next Immediate Action

**Create the `claude-workflows` repository:**
1. `mkdir claude-workflows && cd claude-workflows`
2. `git init`
3. Create directory structure
4. Start writing `core/tdd-workflow.md` based on current CLAUDE.md

Then work through Phase 1 tasks in order.