import { describe, it, beforeEach, afterEach } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { fetchWorkflowFile } from "./lib.ts";

describe("fetchWorkflowFile", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("constructs correct URL and returns file content", async () => {
    const mockContent = "---\nversion: 0.1.0\n---\n# Test File";

    globalThis.fetch = async (url: string | URL | Request) => {
      assertEquals(
        url.toString(),
        "https://raw.githubusercontent.com/test/repo/main/path/to/file.md"
      );

      return new Response(mockContent, { status: 200 });
    };

    const result = await fetchWorkflowFile(
      "https://raw.githubusercontent.com/test/repo",
      "main",
      "path/to/file.md"
    );

    assertEquals(result, mockContent);
  });

  it("throws error with file path when HTTP request fails", async () => {
    globalThis.fetch = async () => {
      return new Response("Not Found", { status: 404, statusText: "Not Found" });
    };

    await assertRejects(
      async () => {
        await fetchWorkflowFile(
          "https://raw.githubusercontent.com/test/repo",
          "main",
          "missing.md"
        );
      },
      Error,
      "Failed to fetch missing.md: HTTP 404 Not Found"
    );
  });

  it("throws error when network fails", async () => {
    globalThis.fetch = async () => {
      throw new TypeError("Network error");
    };

    await assertRejects(
      async () => {
        await fetchWorkflowFile(
          "https://raw.githubusercontent.com/test/repo",
          "main",
          "file.md"
        );
      },
      Error,
      "Failed to fetch file.md"
    );
  });
});
