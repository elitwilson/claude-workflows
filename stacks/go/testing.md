# Go Testing

## Tools

- **Built-in test framework** - `go test`
- **air** - Hot reload for dev servers (not for testing)

---

## !! CRITICAL !! Table-Driven Tests

**Use table-driven tests for testing multiple scenarios.**

This is the idiomatic Go pattern for testing functions with different inputs:

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive numbers", 2, 3, 5},
        {"negative numbers", -1, -1, -2},
        {"zero", 0, 5, 5},
        {"mixed", -2, 5, 3},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Add(%d, %d) = %d; want %d", tt.a, tt.b, result, tt.expected)
            }
        })
    }
}
```

**Benefits:**
- Easy to add new test cases
- Clear test case names with `t.Run`
- Reduces duplication
- Idiomatic Go

---

## Test Organization

**Test files:** `*_test.go` in the same package

```go
// math.go
package math

func Add(a, b int) int {
    return a + b
}

// math_test.go
package math

import "testing"

func TestAdd(t *testing.T) {
    // table-driven test here
}
```

---

## Testing Guidelines

Follow core TDD workflow testing principles (see [core/tdd-workflow.md](../../core/tdd-workflow.md)).

**Go-specific:**
- Use table-driven tests for multiple scenarios
- Test file naming: `*_test.go`
- Use `t.Helper()` for test helper functions
- Use subtests with `t.Run()` for organization
