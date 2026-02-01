import { describe, it, expect } from "vitest";
import { program } from "../src/cli";

/**
 * Tests for CLI entry point
 * Validates commander setup and command routing
 */

describe("cli", () => {
  describe("program metadata", () => {
    it("has correct name", () => {
      expect(program.name()).toBe("claude-workflows");
    });

    it("has a version", () => {
      expect(program.version()).toBeDefined();
      expect(program.version()).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it("has a description", () => {
      expect(program.description()).toBeDefined();
      expect(program.description().length).toBeGreaterThan(0);
    });
  });

  describe("commands", () => {
    it("has add command", () => {
      const addCmd = program.commands.find((cmd) => cmd.name() === "add");
      expect(addCmd).toBeDefined();
    });

    it("has upgrade command", () => {
      const upgradeCmd = program.commands.find((cmd) => cmd.name() === "upgrade");
      expect(upgradeCmd).toBeDefined();
    });
  });

  describe("upgrade command options", () => {
    it("supports --force flag", () => {
      const upgradeCmd = program.commands.find((cmd) => cmd.name() === "upgrade");
      const forceOption = upgradeCmd?.options.find(
        (opt) => opt.long === "--force"
      );
      expect(forceOption).toBeDefined();
    });

    it("supports --dry-run flag", () => {
      const upgradeCmd = program.commands.find((cmd) => cmd.name() === "upgrade");
      const dryRunOption = upgradeCmd?.options.find(
        (opt) => opt.long === "--dry-run"
      );
      expect(dryRunOption).toBeDefined();
    });
  });

  describe("add command options", () => {
    it("supports --dry-run flag", () => {
      const addCmd = program.commands.find((cmd) => cmd.name() === "add");
      const dryRunOption = addCmd?.options.find(
        (opt) => opt.long === "--dry-run"
      );
      expect(dryRunOption).toBeDefined();
    });
  });
});
