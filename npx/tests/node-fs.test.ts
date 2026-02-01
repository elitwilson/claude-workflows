import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { nodeFs, getHomeDir } from "../src/node-fs";

/**
 * Tests for Node.js FileSystem adapter
 * Validates that nodeFs correctly implements the FileSystem interface
 */

let testDir: string;

beforeEach(async () => {
  testDir = await mkdtemp(join(tmpdir(), "node-fs-test-"));
});

afterEach(async () => {
  await rm(testDir, { recursive: true, force: true });
});

describe("nodeFs", () => {
  describe("mkdir", () => {
    it("creates a directory", async () => {
      const dirPath = join(testDir, "new-dir");

      await nodeFs.mkdir(dirPath, false);

      const exists = await nodeFs.exists(dirPath);
      expect(exists).toBe(true);
    });

    it("creates nested directories when recursive is true", async () => {
      const nestedPath = join(testDir, "a", "b", "c");

      await nodeFs.mkdir(nestedPath, true);

      const exists = await nodeFs.exists(nestedPath);
      expect(exists).toBe(true);
    });

    it("does not throw when directory already exists", async () => {
      const dirPath = join(testDir, "existing-dir");
      await nodeFs.mkdir(dirPath, false);

      // Should not throw
      await expect(nodeFs.mkdir(dirPath, false)).resolves.toBeUndefined();
    });
  });

  describe("exists", () => {
    it("returns true for existing file", async () => {
      const filePath = join(testDir, "test-file.txt");
      await nodeFs.writeFile(filePath, "content");

      const exists = await nodeFs.exists(filePath);
      expect(exists).toBe(true);
    });

    it("returns true for existing directory", async () => {
      const dirPath = join(testDir, "test-dir");
      await nodeFs.mkdir(dirPath, false);

      const exists = await nodeFs.exists(dirPath);
      expect(exists).toBe(true);
    });

    it("returns false for non-existent path", async () => {
      const fakePath = join(testDir, "does-not-exist");

      const exists = await nodeFs.exists(fakePath);
      expect(exists).toBe(false);
    });
  });

  describe("writeFile", () => {
    it("writes content to a file", async () => {
      const filePath = join(testDir, "write-test.txt");
      const content = "hello world";

      await nodeFs.writeFile(filePath, content);

      const readBack = await nodeFs.readFile(filePath);
      expect(readBack).toBe(content);
    });

    it("overwrites existing file content", async () => {
      const filePath = join(testDir, "overwrite-test.txt");
      await nodeFs.writeFile(filePath, "original");

      await nodeFs.writeFile(filePath, "updated");

      const readBack = await nodeFs.readFile(filePath);
      expect(readBack).toBe("updated");
    });

    it("preserves content exactly as provided", async () => {
      const filePath = join(testDir, "exact-content.txt");
      const content = "line1\nline2\n\ttabbed\n";

      await nodeFs.writeFile(filePath, content);

      const readBack = await nodeFs.readFile(filePath);
      expect(readBack).toBe(content);
    });
  });

  describe("readFile", () => {
    it("reads content from a file", async () => {
      const filePath = join(testDir, "read-test.txt");
      const content = "test content";
      await nodeFs.writeFile(filePath, content);

      const result = await nodeFs.readFile(filePath);
      expect(result).toBe(content);
    });

    it("throws error for non-existent file", async () => {
      const fakePath = join(testDir, "no-such-file.txt");

      await expect(nodeFs.readFile(fakePath)).rejects.toThrow();
    });
  });

  describe("readDir", () => {
    it("returns array of directory entries", async () => {
      await nodeFs.writeFile(join(testDir, "file1.txt"), "content1");
      await nodeFs.writeFile(join(testDir, "file2.txt"), "content2");

      const entries = await nodeFs.readDir(testDir);
      const names = entries.map((e) => e.name).sort();

      expect(names).toEqual(["file1.txt", "file2.txt"]);
    });

    it("correctly identifies files vs directories", async () => {
      await nodeFs.writeFile(join(testDir, "a-file.txt"), "content");
      await nodeFs.mkdir(join(testDir, "a-dir"), false);

      const entries = await nodeFs.readDir(testDir);
      const file = entries.find((e) => e.name === "a-file.txt");
      const dir = entries.find((e) => e.name === "a-dir");

      expect(file?.isFile).toBe(true);
      expect(file?.isDirectory).toBe(false);
      expect(dir?.isFile).toBe(false);
      expect(dir?.isDirectory).toBe(true);
    });

    it("returns empty array for empty directory", async () => {
      const emptyDir = join(testDir, "empty");
      await nodeFs.mkdir(emptyDir, false);

      const entries = await nodeFs.readDir(emptyDir);
      expect(entries).toEqual([]);
    });
  });
});

describe("getHomeDir", () => {
  const originalHome = process.env.HOME;

  afterEach(() => {
    if (originalHome !== undefined) {
      process.env.HOME = originalHome;
    } else {
      delete process.env.HOME;
    }
  });

  it("returns home directory from HOME env var", () => {
    process.env.HOME = "/test/home";

    const result = getHomeDir();
    expect(result).toBe("/test/home");
  });

  it("throws error when HOME is not set", () => {
    delete process.env.HOME;

    expect(() => getHomeDir()).toThrow("HOME environment variable is not set");
  });
});
