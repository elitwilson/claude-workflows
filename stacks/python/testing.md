---
version: 0.1.0
updated: 2026-01-30
---

# Python Testing

## Tools

- **pytest** - Testing framework
- **pytest-watch (ptw)** - Watch mode for developer's terminal during TDD

---

## !! CRITICAL !! Parameterized Tests

**Use parameterized tests to reduce duplication when testing contracts.**

When multiple implementations share an interface/contract:

```python
import pytest

@pytest.mark.parametrize("implementation", [
    ConcreteImplementationA(),
    ConcreteImplementationB(),
])
def test_shared_contract(implementation):
    """Test that all implementations satisfy the contract."""
    result = implementation.process("input")
    assert result.is_valid()
    assert result.has_expected_structure()
```

**Also use for multiple input scenarios:**

```python
@pytest.mark.parametrize("input,expected", [
    ("valid_input", True),
    ("", False),
    (None, False),
])
def test_validation(input, expected):
    assert validate(input) == expected
```

---

## Testing Guidelines

**Python-specific:**
- Test files: `test_*.py` in `tests/` directory
- Test functions: `test_*`
- Async tests: Use `@pytest.mark.asyncio`
- Use fixtures for common setup
