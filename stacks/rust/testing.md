---
version: 0.1.0
updated: 2026-01-30
---

# Rust Testing

## Tools

- **Built-in test framework** - `cargo test`
- **cargo-watch** - Watch mode for developer's terminal during TDD

---

## Test Organization

**Unit tests:** In the same file as the code

```rust
// src/lib.rs or src/module.rs
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 2), 4);
    }
}
```

**Integration tests:** In `tests/` directory

```rust
// tests/integration_test.rs
use my_crate::public_api;

#[test]
fn test_integration() {
    let result = public_api::process_data();
    assert!(result.is_ok());
}
```

---

## Testing Guidelines

Follow core TDD workflow testing principles (see [core/tdd-workflow.md](../../core/tdd-workflow.md)).

**Rust-specific:**
- Use `assert!`, `assert_eq!`, `assert_ne!` for assertions
- Use `#[should_panic]` for tests expecting panics
- Use `Result<()>` return type for tests that can fail with `?`
