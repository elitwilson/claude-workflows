#!/usr/bin/env node
/**
 * CLI entry point for claude-workflows
 * Provides add and upgrade commands via commander
 */

import { Command } from "commander";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const program = new Command();

program
  .name("claude-workflows")
  .version("0.1.0")
  .description("Add and upgrade Claude workflow rules");

program
  .command("add")
  .description("Install workflow files from the repository")
  .option("--dry-run", "Preview changes without writing files")
  .action(async (options) => {
    const { runAdd } = await import("./commands/add");
    await runAdd(options);
  });

program
  .command("upgrade")
  .description("Update installed workflow files to latest versions")
  .option("--force", "Overwrite locally modified files")
  .option("--dry-run", "Preview changes without writing files")
  .action(async (options) => {
    const { runUpgrade } = await import("./commands/upgrade");
    await runUpgrade(options);
  });

// Only parse when run directly (not when imported for testing)
// resolve() is needed because pnpm's bin wrapper passes argv[1] with unresolved
// relative segments (e.g. /Library/pnpm/../../workdev/...) which won't match
// the canonical path in import.meta.url
if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  program.parse();
}
