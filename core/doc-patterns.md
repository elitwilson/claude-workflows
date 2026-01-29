# Documentation Patterns

## What to Document

**Document decisions, not code:**
- Why you chose approach X over Y
- Architectural decisions and constraints
- Non-obvious business rules or edge cases
- Integration points and external dependencies
- Known limitations or future considerations

**Document workflows and processes:**
- Feature planning templates
- TDD cycle expectations
- Quality gates and standards
- Git conventions

---

## What NOT to Document

**Avoid documenting:**
- Obvious code behavior (what the code already shows)
- Generic "how to use X framework" tutorials
- Implementation details that change frequently
- Anything AI can infer from reading the code
- Step-by-step explanations of simple functions

**Rule of thumb:** If the code is self-explanatory, don't add comments. If the decision behind the code isn't obvious, document the "why."

---

## Where Documentation Lives

**Feature plans:** `[feature-name].md` in project notes/plans directory
- Created during planning phase
- Lives alongside the code
- Updated with important discoveries during development

**Workflow rules:** `.claude/rules/` directory
- Core workflows (TDD, git, etc.)
- Stack-specific patterns
- Referenced by project's `.claude/CLAUDE.md`

**Code comments:** Only when necessary
- Non-obvious business logic
- Workarounds for bugs/limitations
- Complex algorithms that aren't self-explanatory

---

## Keep It Minimal

Less documentation is better than stale documentation. Only write what adds value and will stay relevant.
