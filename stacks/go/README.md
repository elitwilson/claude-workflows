---
version: 0.1.0
updated: 2026-01-30
---

# Go Stack

## Philosophy

**Write idiomatic Go. Standard library first.**

Go's design and tooling are beautifully opinionated. Follow Go conventions and leverage the excellent standard library before reaching for third-party packages.

---

## Tooling

- **go mod** - Package management (standard)
- **gofmt** - Code formatting (standard)
- **go test** - Testing (built-in)
- **air** - Hot reload for dev servers

---

## Quick Commands

```bash
# Setup
go mod init <module>        # Initialize module
go mod tidy                  # Clean up dependencies
go get <package>             # Add dependency

# Testing
go test ./...                # Run all tests
go test -v ./...             # Verbose output

# Code quality
gofmt -w .                   # Format code
go vet ./...                 # Check for issues
go build                     # Build project
go run .                     # Run project
```

---

## Project Structure

Standard Go layout:

```
project/
├── cmd/                     # Main applications
├── internal/                # Private code
├── pkg/                     # Public libraries (optional)
├── go.mod
└── go.sum
```

---

## Stack Rules

- **Code style:** See [code-style.md](code-style.md)
- **Testing patterns:** See [testing.md](testing.md)
