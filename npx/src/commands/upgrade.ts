/**
 * Upgrade command - updates installed workflow files to latest versions
 * Supports --force and --dry-run flags
 */

import { upgradeAll } from "../../../plugins/claude/upgrade.ts";
import { nodeFs, getHomeDir } from "../node-fs";

interface UpgradeOptions {
  force?: boolean;
  dryRun?: boolean;
  // For testing - allows overriding defaults
  projectRoot?: string;
  homeDir?: string;
}

const REPO_OWNER = "elitwilson";
const REPO_NAME = "claude-workflows";
const DEFAULT_BRANCH = "main";

export async function runUpgrade(options: UpgradeOptions): Promise<void> {
  const force = options.force ?? false;
  const dryRun = options.dryRun ?? false;
  const homeDir = options.homeDir ?? getHomeDir();
  const projectRoot = options.projectRoot ?? process.cwd();

  const repoUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}`;

  console.log("Upgrade Claude Workflows\n");

  if (dryRun) {
    console.log("Dry-run mode: No files will be modified\n");
  }

  const { global: globalResult, project: projectResult } = await upgradeAll(
    projectRoot,
    homeDir,
    repoUrl,
    DEFAULT_BRANCH,
    force,
    dryRun,
    nodeFs
  );

  // Print global summary
  console.log("\nGlobal (~/.claude/) Summary:");
  console.log(`  Upgraded: ${globalResult.upgraded.length}`);
  console.log(`  Skipped: ${globalResult.skipped.length}`);
  console.log(`  Errors: ${globalResult.errors.length}`);

  if (globalResult.skipped.length > 0) {
    console.log("\nSkipped:");
    globalResult.skipped.forEach(({ file, reason }) => {
      console.log(`  - ${file}: ${reason}`);
    });
  }

  if (globalResult.errors.length > 0) {
    console.log("\nErrors:");
    globalResult.errors.forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`);
    });
  }

  // Print project summary
  console.log("\nProject (.claude/) Summary:");
  console.log(`  Upgraded: ${projectResult.upgraded.length}`);
  console.log(`  Skipped: ${projectResult.skipped.length}`);
  console.log(`  Errors: ${projectResult.errors.length}`);

  if (projectResult.skipped.length > 0) {
    console.log("\nSkipped:");
    projectResult.skipped.forEach(({ file, reason }) => {
      console.log(`  - ${file}: ${reason}`);
    });
  }

  if (projectResult.errors.length > 0) {
    console.log("\nErrors:");
    projectResult.errors.forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`);
    });
  }

  console.log(`\nUpgrade ${dryRun ? "preview" : ""} complete!`);
}
