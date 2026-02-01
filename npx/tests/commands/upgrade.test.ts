import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Mock the upgradeAll function from shared logic
vi.mock("../../../plugins/claude/upgrade.ts", () => ({
  upgradeAll: vi.fn(),
}));

import { runUpgrade } from "../../src/commands/upgrade";
import { upgradeAll } from "../../../plugins/claude/upgrade.ts";

const mockUpgradeAll = vi.mocked(upgradeAll);

describe("runUpgrade", () => {
  let testDir: string;
  let projectDir: string;

  beforeEach(async () => {
    testDir = await mkdtemp(join(tmpdir(), "upgrade-test-"));
    projectDir = join(testDir, "project");

    // Create .claude directories
    await mkdir(join(testDir, ".claude", "rules"), { recursive: true });
    await mkdir(join(projectDir, ".claude", "rules"), { recursive: true });

    mockUpgradeAll.mockReset();
    mockUpgradeAll.mockResolvedValue({
      global: { upgraded: [], skipped: [], errors: [] },
      project: { upgraded: [], skipped: [], errors: [] },
    });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it("calls upgradeAll with correct parameters", async () => {
    await runUpgrade({
      force: false,
      dryRun: false,
      projectRoot: projectDir,
      homeDir: testDir,
    });

    expect(mockUpgradeAll).toHaveBeenCalledTimes(1);
    const [projectRoot, homeDir, repoUrl, branch, force, dryRun] =
      mockUpgradeAll.mock.calls[0];

    expect(projectRoot).toBe(projectDir);
    expect(homeDir).toBe(testDir);
    expect(repoUrl).toContain("raw.githubusercontent.com");
    expect(branch).toBe("main");
    expect(force).toBe(false);
    expect(dryRun).toBe(false);
  });

  it("passes force flag to upgradeAll", async () => {
    await runUpgrade({
      force: true,
      dryRun: false,
      projectRoot: projectDir,
      homeDir: testDir,
    });

    const [, , , , force] = mockUpgradeAll.mock.calls[0];
    expect(force).toBe(true);
  });

  it("passes dryRun flag to upgradeAll", async () => {
    await runUpgrade({
      force: false,
      dryRun: true,
      projectRoot: projectDir,
      homeDir: testDir,
    });

    const [, , , , , dryRun] = mockUpgradeAll.mock.calls[0];
    expect(dryRun).toBe(true);
  });

  it("uses nodeFs for filesystem operations", async () => {
    await runUpgrade({
      force: false,
      dryRun: false,
      projectRoot: projectDir,
      homeDir: testDir,
    });

    const [, , , , , , fs] = mockUpgradeAll.mock.calls[0];
    expect(fs).toBeDefined();
    expect(typeof fs.mkdir).toBe("function");
    expect(typeof fs.readFile).toBe("function");
  });
});
