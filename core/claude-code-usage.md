# Claude Code Tool Usage Rules

## !! CRITICAL !! Plan Mode

**Do NOT enter plan mode unless specifically requested.**

The user's development workflow is collaborative and interactive through the main conversation thread. Brainstorming and planning happen in the conversation, not in isolated plan mode.

---

## !! CRITICAL !! Explore Agents

**Do NOT use explore sub-agents unless specifically requested.**

- Never spawn explore agents for codebase exploration
- Use direct tools (Glob, Grep, Read) instead
- Only use explore agents if the user explicitly asks

---

## !! CRITICAL !! Question Format

**Never use interactive question/answer tools.**

Format questions as numbered list in the conversation:
1. Question one?
2. Question two?

The user will respond by number in the main thread.
