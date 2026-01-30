import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { assertStringIncludes, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { fetchWorkflowFile } from "./lib.ts";

describe("fetchWorkflowFile", () => {
  it("fetches a workflow file from GitHub", async () => {
    const content = await fetchWorkflowFile(
      "https://raw.githubusercontent.com/elitwilson/claude-workflows",
      "main",
      "core/tdd-workflow.md"
    );

    assertStringIncludes(content, "# TDD Workflow");
    assertStringIncludes(content, "version: 0.1.0");
  });

  it("throws error for non-existent file", async () => {
    await assertRejects(
      async () => {
        await fetchWorkflowFile(
          "https://raw.githubusercontent.com/elitwilson/claude-workflows",
          "main",
          "does-not-exist.md"
        );
      },
      Error,
      "Failed to fetch"
    );
  });

  it("throws error for invalid URL", async () => {
    await assertRejects(
      async () => {
        await fetchWorkflowFile(
          "https://invalid-repo-url.com",
          "main",
          "core/tdd-workflow.md"
        );
      },
      Error
    );
  });
});
