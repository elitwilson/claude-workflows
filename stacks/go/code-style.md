---
version: 0.1.0
updated: 2026-01-30
---

---
version: 0.1.0
updated: 2026-01-30
---

# Go Code Style

## Philosophy

**Write idiomatic Go. Standard library first.**

Go's standard library is excellent and can handle most use cases. Reach for it before adding third-party dependencies.

---

## !! CRITICAL !! Standard Library First

**Prefer standard library over third-party packages.**

```go
// ✅ Good - use net/http for most HTTP needs
import "net/http"

func handler(w http.ResponseWriter, r *http.Request) {
    // Standard library handles most cases
}

// ❌ Avoid - unnecessary framework for simple cases
import "github.com/gin-gonic/gin"
// Only use frameworks when standard lib truly can't handle it
```

**When to use third-party libraries:**
- Standard library genuinely can't solve the problem
- Significant complexity reduction
- Well-maintained, idiomatic Go libraries

---

## Error Handling

**Always handle errors. Never ignore them.**

```go
// ❌ Avoid - ignoring errors
result, _ := doSomething()

// ✅ Good - handle errors properly
result, err := doSomething()
if err != nil {
    return fmt.Errorf("failed to do something: %w", err)
}
```

**Use error wrapping with `%w` to preserve error chains.**

---

## Interfaces

**Don't create interfaces prematurely.**

```go
// ❌ Avoid - premature interface
type UserRepository interface {
    GetUser(id int) (*User, error)
}

type PostgresUserRepository struct{}
// Only one implementation exists

// ✅ Good - use concrete type until interface is needed
type UserRepository struct {
    db *sql.DB
}
// Create interface when multiple implementations emerge
```

**Accept interfaces, return concrete types.**

---

## Tooling

```bash
gofmt -w .     # Format code
go vet ./...   # Check for common mistakes
```

Follow `gofmt` and `go vet` without exception.
