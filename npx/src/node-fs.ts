/**
 * Node.js runtime adapter for FileSystem operations
 * This file contains Node-specific implementations and should only be imported
 * by Node-based entry points (cli.ts, commands/*.ts)
 */

import { mkdir as fsMkdir, stat, writeFile, readFile, readdir } from "node:fs/promises";
import type { FileSystem, DirEntry } from "../../plugins/claude/lib.ts";

/**
 * Gets the home directory from the HOME environment variable
 * Throws an error if HOME is not set
 */
export function getHomeDir(): string {
  const home = process.env.HOME;

  if (!home) {
    throw new Error("HOME environment variable is not set");
  }

  return home;
}

/**
 * Node.js implementation of FileSystem interface
 */
export const nodeFs: FileSystem = {
  async mkdir(path: string, recursive: boolean): Promise<void> {
    try {
      await fsMkdir(path, { recursive });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST") {
        return;
      }
      throw error;
    }
  },

  async exists(path: string): Promise<boolean> {
    try {
      await stat(path);
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return false;
      }
      throw error;
    }
  },

  async writeFile(path: string, content: string): Promise<void> {
    await writeFile(path, content, "utf-8");
  },

  async readFile(path: string): Promise<string> {
    return await readFile(path, "utf-8");
  },

  async readDir(path: string): Promise<DirEntry[]> {
    const entries = await readdir(path, { withFileTypes: true });

    return entries.map((entry) => ({
      name: entry.name,
      isFile: entry.isFile(),
      isDirectory: entry.isDirectory(),
    }));
  },
};
