import { describe, it, beforeEach, afterEach } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { fetchWorkflowFile, ensureDirectory, writeWorkflowFile, type FileSystem } from "./lib.ts";

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

describe("ensureDirectory", () => {
  it("creates directory when it doesn't exist", async () => {
    const logs: string[] = [];
    const createdDirs: string[] = [];

    const mockFs: FileSystem = {
      mkdir: async (path: string, recursive: boolean) => {
        createdDirs.push(path);
      },
      exists: async (path: string) => false,
      writeFile: async () => {},
      readFile: async () => "",
    };

    const log = (msg: string) => logs.push(msg);

    await ensureDirectory(".claude/rules", false, mockFs, log);

    assertEquals(createdDirs, [".claude/rules"]);
    assertEquals(logs, ["Created directory: .claude/rules"]);
  });

  it("does not create directory when it already exists", async () => {
    const logs: string[] = [];
    const createdDirs: string[] = [];

    const mockFs: FileSystem = {
      mkdir: async (path: string) => {
        createdDirs.push(path);
      },
      exists: async (path: string) => true,
      writeFile: async () => {},
      readFile: async () => "",
    };

    const log = (msg: string) => logs.push(msg);

    await ensureDirectory(".claude", false, mockFs, log);

    assertEquals(createdDirs, []);
    assertEquals(logs, []);
  });

  it("logs intended action in dry-run mode without creating directory", async () => {
    const logs: string[] = [];
    const createdDirs: string[] = [];

    const mockFs: FileSystem = {
      mkdir: async (path: string) => {
        createdDirs.push(path);
      },
      exists: async (path: string) => false,
      writeFile: async () => {},
      readFile: async () => "",
    };

    const log = (msg: string) => logs.push(msg);

    await ensureDirectory(".claude/rules", true, mockFs, log);

    assertEquals(createdDirs, []);
    assertEquals(logs, ["Would create directory: .claude/rules"]);
  });

  it("does not check existence in dry-run mode", async () => {
    const logs: string[] = [];
    let existsCalled = false;

    const mockFs: FileSystem = {
      mkdir: async () => {},
      exists: async () => {
        existsCalled = true;
        return false;
      },
      writeFile: async () => {},
      readFile: async () => "",
    };

    const log = (msg: string) => logs.push(msg);

    await ensureDirectory(".claude", true, mockFs, log);

    assertEquals(existsCalled, false);
    assertEquals(logs, ["Would create directory: .claude"]);
  });
});

describe("writeWorkflowFile", () => {
  it("writes file content to specified path", async () => {
    const logs: string[] = [];
    const writtenFiles = new Map<string, string>();

    const mockFs: FileSystem = {
      mkdir: async () => {},
      exists: async () => true,
      writeFile: async (path: string, content: string) => {
        writtenFiles.set(path, content);
      },
      readFile: async () => "",
    };

    const log = (msg: string) => logs.push(msg);
    const content = "---\nversion: 0.1.0\n---\n# TDD Workflow";

    await writeWorkflowFile(".claude/rules/tdd-workflow.md", content, false, mockFs, log);

    assertEquals(writtenFiles.get(".claude/rules/tdd-workflow.md"), content);
    assertEquals(logs, ["Wrote file: .claude/rules/tdd-workflow.md"]);
  });

  it("logs intended action in dry-run mode without writing file", async () => {
    const logs: string[] = [];
    const writtenFiles = new Map<string, string>();

    const mockFs: FileSystem = {
      mkdir: async () => {},
      exists: async () => true,
      writeFile: async (path: string, content: string) => {
        writtenFiles.set(path, content);
      },
      readFile: async () => "",
    };

    const log = (msg: string) => logs.push(msg);
    const content = "---\nversion: 0.1.0\n---\n# TDD Workflow";

    await writeWorkflowFile(".claude/rules/tdd-workflow.md", content, true, mockFs, log);

    assertEquals(writtenFiles.size, 0);
    assertEquals(logs, ["Would write file: .claude/rules/tdd-workflow.md"]);
  });

  it("preserves file content exactly as provided", async () => {
    const writtenFiles = new Map<string, string>();

    const mockFs: FileSystem = {
      mkdir: async () => {},
      exists: async () => true,
      writeFile: async (path: string, content: string) => {
        writtenFiles.set(path, content);
      },
      readFile: async () => "",
    };

    const content = "Line 1\nLine 2\n\nLine 4 with    spaces\n\tTabbed line";

    await writeWorkflowFile("test.md", content, false, mockFs, () => {});

    assertEquals(writtenFiles.get("test.md"), content);
  });
});
