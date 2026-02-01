import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Mock inquirer
vi.mock("inquirer", () => ({
  default: {
    prompt: vi.fn(),
  },
}));

// Mock discovery functions
vi.mock("../../../plugins/claude/discovery.ts", () => ({
  discoverCoreWorkflows: vi.fn(),
  discoverStacks: vi.fn(),
  discoverStackWorkflows: vi.fn(),
}));

// Mock lib functions for file operations
vi.mock("../../../plugins/claude/lib.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../plugins/claude/lib.ts")>();
  return {
    ...actual,
    fetchWorkflowFile: vi.fn(),
  };
});

import inquirer from "inquirer";
import { runAdd } from "../../src/commands/add";
import {
  discoverCoreWorkflows,
  discoverStacks,
  discoverStackWorkflows,
} from "../../../plugins/claude/discovery.ts";
import { fetchWorkflowFile } from "../../../plugins/claude/lib.ts";

const mockPrompt = vi.mocked(inquirer.prompt);
const mockDiscoverCore = vi.mocked(discoverCoreWorkflows);
const mockDiscoverStacks = vi.mocked(discoverStacks);
const mockDiscoverStackWorkflows = vi.mocked(discoverStackWorkflows);
const mockFetchWorkflow = vi.mocked(fetchWorkflowFile);

describe("runAdd", () => {
  let testDir: string;
  let projectDir: string;

  beforeEach(async () => {
    testDir = await mkdtemp(join(tmpdir(), "add-test-"));
    projectDir = join(testDir, "project");
    await mkdir(projectDir, { recursive: true });

    // Reset all mocks
    vi.clearAllMocks();

    // Default mock responses
    mockDiscoverCore.mockResolvedValue([
      { name: "tdd-workflow.md", path: "workflows/core/tdd-workflow.md" },
    ]);
    mockDiscoverStacks.mockResolvedValue([
      { name: "python", displayName: "Python" },
    ]);
    mockDiscoverStackWorkflows.mockResolvedValue([
      { name: "testing.md", path: "workflows/stacks/python/testing.md" },
    ]);
    mockFetchWorkflow.mockResolvedValue("---\nversion: 1.0.0\n---\n# Content");
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it("prompts for scope selection", async () => {
    mockPrompt.mockResolvedValueOnce({ scope: "project" });
    mockPrompt.mockResolvedValueOnce({ coreWorkflows: [] });
    mockPrompt.mockResolvedValueOnce({ stacks: [] });

    await runAdd({
      dryRun: true,
      projectRoot: projectDir,
      homeDir: testDir,
    });

    expect(mockPrompt).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: "scope",
          type: "list",
        }),
      ])
    );
  });

  it("prompts for core workflow selection", async () => {
    mockPrompt.mockResolvedValueOnce({ scope: "project" });
    mockPrompt.mockResolvedValueOnce({ coreWorkflows: [] });
    mockPrompt.mockResolvedValueOnce({ stacks: [] });

    await runAdd({
      dryRun: true,
      projectRoot: projectDir,
      homeDir: testDir,
    });

    expect(mockPrompt).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: "coreWorkflows",
          type: "checkbox",
        }),
      ])
    );
  });

  it("prompts for stack selection", async () => {
    mockPrompt.mockResolvedValueOnce({ scope: "project" });
    mockPrompt.mockResolvedValueOnce({ coreWorkflows: [] });
    mockPrompt.mockResolvedValueOnce({ stacks: [] });

    await runAdd({
      dryRun: true,
      projectRoot: projectDir,
      homeDir: testDir,
    });

    expect(mockPrompt).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: "stacks",
          type: "checkbox",
        }),
      ])
    );
  });

  it("fetches selected workflow files", async () => {
    mockPrompt.mockResolvedValueOnce({ scope: "project" });
    mockPrompt.mockResolvedValueOnce({
      coreWorkflows: ["workflows/core/tdd-workflow.md"],
    });
    mockPrompt.mockResolvedValueOnce({ stacks: [] });

    await runAdd({
      dryRun: false,
      projectRoot: projectDir,
      homeDir: testDir,
    });

    expect(mockFetchWorkflow).toHaveBeenCalledWith(
      expect.stringContaining("raw.githubusercontent.com"),
      "main",
      "workflows/core/tdd-workflow.md"
    );
  });

  it("respects dry-run flag", async () => {
    mockPrompt.mockResolvedValueOnce({ scope: "project" });
    mockPrompt.mockResolvedValueOnce({
      coreWorkflows: ["workflows/core/tdd-workflow.md"],
    });
    mockPrompt.mockResolvedValueOnce({ stacks: [] });

    await runAdd({
      dryRun: true,
      projectRoot: projectDir,
      homeDir: testDir,
    });

    // Should still fetch to show what would be installed
    expect(mockFetchWorkflow).toHaveBeenCalled();
  });
});
