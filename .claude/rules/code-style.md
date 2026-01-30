---
version: 0.1.0
updated: 2026-01-30
---

# Python Code Style

## !! CRITICAL !! Core Philosophy

**Modern, functional-first Python.**

- Default to pure functions and procedural code
- Use classes primarily for data (Pydantic models, dataclasses)
- Avoid class-based encapsulation unless compelling reason exists
- Strong typing without excessive strictness

---

## Functional-First Pattern

**Prefer pure functions over class encapsulation:**

```python
# ✅ Good - pure functions
def process_user_data(user: User) -> ProcessedData:
    validated = validate_user(user)
    transformed = transform_data(validated)
    return save_result(transformed)

# ❌ Avoid - unnecessary class encapsulation
class UserProcessor:
    def __init__(self, user: User):
        self.user = user

    def process(self) -> ProcessedData:
        self.validate()
        self.transform()
        return self.save()
```

**Use classes for data models:**

```python
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    email: str
```

---

## Type Hints

**Modern Python 3.12+ syntax:**
- Use `list[T]` not `List[T]`
- Use `dict[K, V]` not `Dict[K, V]`
- Use `X | Y` not `Union[X, Y]`
- Use `X | None` not `Optional[X]`

**Keep types helpful, not burdensome.** Type what clarifies intent, skip excessive type complexity.

---

## Tooling

**Use Ruff for formatting and linting:**
- `ruff format .` - Format code
- `ruff check .` - Lint code
- `ruff check --fix .` - Auto-fix issues

**Use mypy for type checking** with pragmatic strictness.
