---
version: 0.1.0
updated: 2026-01-30
---

# Rust Stack

## Philosophy

**Write idiomatic Rust.**

Rust's language design enforces many good patterns by default. Follow Rust conventions and let the compiler guide you.

---

## Tooling

- **cargo** - Build tool and package manager (standard)
- **rustfmt** - Code formatting (standard)
- **clippy** - Linting (standard)
- **cargo-watch** - Watch mode for TDD

---

## Quick Commands

```bash
# Setup
cargo new project_name      # Create new project
cargo add <crate>            # Add dependency

# Testing
cargo test                   # Run all tests

# Code quality
cargo fmt                    # Format code
cargo clippy                 # Lint code
cargo build                  # Build project
cargo run                    # Run project
```

---

## Project Structure

Standard Rust structure:

```
project/
├── src/
│   ├── lib.rs (or main.rs)
│   └── modules/
├── tests/
├── Cargo.toml
└── Cargo.lock
```

---

## Stack Rules

- **Code style:** See [code-style.md](code-style.md)
- **Testing patterns:** See [testing.md](testing.md)
