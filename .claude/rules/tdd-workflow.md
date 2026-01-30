---
version: 0.1.0
updated: 2026-01-30
---

# TDD Workflow

## !! CRITICAL !! Core Principles

**Ownership:** Developer owns planning and architectural decisions. AI executes the plan.

**Ask questions - don't guess:**
- Never invent features that weren't discussed
- Always ask when plan is unclear or ambiguous
- Check for existing code/types before creating duplicates
- Check for existing test files before creating new ones

**Prerequisites:** Before starting TDD, you must have a complete feature plan (see FEATURE_PLAN template) with:
- Architectural decisions documented
- Clear scope (in AND out)
- Success criteria defined

---

## The TDD Cycle

### Planning/Brainstorming Phase

**Goal:** Create concrete, unambiguous plan

**Process:**
- Collaborative discussion between developer and AI
- Developer makes architectural decisions
- AI asks questions and proposes next steps
- Result: Feature plan document following template

**Quality gate:**
- [ ] Architectural decisions documented
- [ ] Clear scope (what we're building AND what we're not)
- [ ] Success criteria defined
- [ ] No ambiguity requiring guessing

---

### RED Phase: Scaffold Tests

**Goal:** Define what we plan to test (not implementation yet)

**Process:**
1. Create empty test file(s) with scaffolded test cases
2. Use `assert true == false` as placeholder
3. Developer reviews scaffold before proceeding

**Focus on:**
- Core functionality (happy path)
- Critical error paths
- Critical edge cases

**Avoid:**
- Rare edge cases or error conditions
- Testing implementation details
- Testing framework behavior
- Trivial/obvious cases with no value

**Quality gate:**
- [ ] Developer approved test scaffold
- [ ] Tests are meaningful (not testing stupid things)
- [ ] No implementation detail testing
- [ ] Critical paths and edge cases covered

**Git commit:** `test: scaffold [feature] tests`

---

### RED Phase: Real Tests

**Goal:** Write failing tests that define the contract

**Process:**
1. Convert scaffolded tests to real failing tests
2. Write assertions defining expected behavior
3. Run tests - verify they fail for right reasons

**Quality gate:**
- [ ] All tests fail with clear, expected failures
- [ ] Failures indicate missing implementation (not bugs in tests)
- [ ] Tests define clear contracts

**Git commit:** `test: add failing tests for [feature]`

---

### GREEN Phase: Implementation

**Goal:** Make tests pass with minimal, correct code

**Process:**
1. Write implementation to satisfy test contracts
2. Run tests frequently
3. Make tests pass one at a time

**Rules:**
- Don't add features not in the plan
- Don't guess - ask if unclear
- Check for existing code before creating duplicates
- Follow established codebase patterns

**Quality gate:**
- [ ] All tests pass
- [ ] Implementation matches the plan
- [ ] No unplanned features added
- [ ] No code duplication

**Git commit:** `feat: implement [feature]`

---

### REFACTOR Phase (Optional)

**Goal:** Improve code quality without changing behavior

**Only refactor if:**
- Obvious duplication exists
- High complexity can be simplified
- Code readability suffers

**Quality gate:**
- [ ] All tests still pass
- [ ] Code is measurably better

**Git commit:** `refactor: [description]`

---

## Phase Transitions

**AI must ask questions and propose next steps before each phase transition.**

Format questions as numbered list:
1. Question one?
2. Question two?

Then propose: "Next steps: [concrete actions]"

Wait for explicit developer approval:
- "Scaffold looks good, write the real tests"
- "Tests are solid, implement the feature"
- "Implementation complete, refactor [specific thing]"

**Never skip phases.**

---

## Testing Principles

**DO test:**
- Public interfaces and contracts
- Critical business logic
- Error handling for critical paths
- Edge cases that could cause failures

**DON'T test:**
- Private methods (test through public interface)
- Framework/library behavior
- Trivial computations or getters/setters
- Implementation details that could change

**Rule of thumb:** If refactoring breaks the test without changing behavior, you're testing implementation details.

---

## Git Workflow

**Commit at the end of each TDD phase. Never commit mid-phase.**

**Commit messages** (conventional commits format):
- After RED scaffold: `test: scaffold [feature] tests`
- After RED real tests: `test: add failing tests for [feature]`
- After GREEN: `feat: implement [feature]`
- After REFACTOR: `refactor: [description]`

**Other commit types:**
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `chore:` - Build, tooling, dependencies

**Keep descriptions concise and imperative** (e.g., "implement feature" not "implemented the feature").