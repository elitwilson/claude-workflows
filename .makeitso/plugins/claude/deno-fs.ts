/**
 * Deno runtime adapter for FileSystem operations
 * This file contains Deno-specific implementations and should only be imported
 * by Deno-based entry points (init.ts, upgrade.ts, add.ts)
 */

import type { FileSystem } from "./lib.ts";

/**
 * Deno implementation of FileSystem interface
 */
export const denoFs: FileSystem = {
  async mkdir(path: string, recursive: boolean): Promise<void> {
    await Deno.mkdir(path, { recursive });
  },

  async exists(path: string): Promise<boolean> {
    try {
      await Deno.stat(path);
      return true;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return false;
      }
      throw error;
    }
  },

  async writeFile(path: string, content: string): Promise<void> {
    await Deno.writeTextFile(path, content);
  },

  async readFile(path: string): Promise<string> {
    return await Deno.readTextFile(path);
  },
};
