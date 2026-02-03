#!/usr/bin/env node
/**
 * CLI entry point for claude-workflows
 * Provides add and upgrade commands via commander
 */

import { Command } from "commander";
import { realpathSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Inquirer v9 hides the cursor during prompts. If SIGINT arrives before it
// can restore it, the cursor stays invisible. Handle it at the process level
// so the restore happens synchronously on the signal, before the process exits.
process.on("SIGINT", () => {
  process.stdout.write("\x1B[?25h\n");
  process.exit(0);
});

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

// Only parse when run directly (not when imported for testing).
// realpathSync is needed to handle both pnpm (unresolved ../.. segments in argv[1])
// and npx (argv[1] is a .bin symlink, import.meta.url is the real path).
if (fileURLToPath(import.meta.url) === realpathSync(resolve(process.argv[1]))) {
  program.parse();
}
