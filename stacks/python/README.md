---
version: 0.1.1
updated: 2026-01-30
---

# Python Stack

## Philosophy

**Modern, functional-first Python.**

- Procedural code with pure functions as default
- Classes for data models only (Pydantic, dataclasses)
- Avoid class-based encapsulation unless compelling reason
- Strong typing without excessive strictness
- Python 3.12+

---

## Tooling

- **uv** - Package management and virtual environments
- **pytest + ptw** - Testing and watch mode
- **ruff** - Formatting and linting
- **mypy** - Type checking

---

## Quick Commands

```bash
# Setup
uv sync                    # Install dependencies
uv add <package>           # Add dependency

# Testing
pytest                     # Run all tests

# Code quality
ruff format .              # Format code
ruff check .               # Lint code
mypy src/                  # Type check
```

---

## Project Structure

```
project/
├── src/
│   └── package_name/
├── tests/
├── pyproject.toml
└── uv.lock
```

---

## Stack Rules

- **Code style:** See [code-style.md](code-style.md)
- **Testing patterns:** See [testing.md](testing.md)
