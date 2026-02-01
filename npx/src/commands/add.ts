/**
 * Add command - installs workflow files from the repository
 * Uses inquirer for interactive prompts
 */

import inquirer from "inquirer";
import {
  discoverCoreWorkflows,
  discoverStacks,
  discoverStackWorkflows,
} from "../../../plugins/claude/discovery.ts";
import {
  fetchWorkflowFile,
  ensureDirectory,
  writeWorkflowFile,
  getTargetDirectory,
  type Scope,
} from "../../../plugins/claude/lib.ts";
import {
  loadMetadata,
  saveMetadata,
  addFileToMetadata,
} from "../../../plugins/claude/metadata.ts";
import { nodeFs, getHomeDir } from "../node-fs";

interface AddOptions {
  dryRun?: boolean;
  // For testing - allows overriding defaults
  projectRoot?: string;
  homeDir?: string;
}

const REPO_OWNER = "elitwilson";
const REPO_NAME = "claude-workflows";
const DEFAULT_BRANCH = "main";

export async function runAdd(options: AddOptions): Promise<void> {
  const dryRun = options.dryRun ?? false;
  const homeDir = options.homeDir ?? getHomeDir();
  const projectRoot = options.projectRoot ?? process.cwd();

  console.log("Add Claude Workflows\n");

  // Scope selection
  const { scope } = await inquirer.prompt<{ scope: Scope }>([
    {
      name: "scope",
      type: "list",
      message: "Install to:",
      choices: [
        { name: "Project (.claude/)", value: "project" },
        { name: "Global (~/.claude/)", value: "global" },
      ],
      default: "project",
    },
  ]);

  console.log(`\nInstalling to ${scope} scope\n`);
  console.log("Discovering available workflows...\n");

  // Discover available workflows
  const coreWorkflows = await discoverCoreWorkflows(
    REPO_OWNER,
    REPO_NAME,
    DEFAULT_BRANCH
  );
  const availableStacks = await discoverStacks(
    REPO_OWNER,
    REPO_NAME,
    DEFAULT_BRANCH
  );

  // Select core workflows
  const { coreWorkflows: selectedCore } = await inquirer.prompt<{
    coreWorkflows: string[];
  }>([
    {
      name: "coreWorkflows",
      type: "checkbox",
      message: "Select core workflows to install:",
      choices: coreWorkflows.map((w) => ({ name: w.name, value: w.path })),
    },
  ]);

  console.log(`\nSelected ${selectedCore.length} core workflow(s)\n`);

  // Select stacks
  const { stacks: selectedStackNames } = await inquirer.prompt<{
    stacks: string[];
  }>([
    {
      name: "stacks",
      type: "checkbox",
      message: "Select language stacks to install:",
      choices: availableStacks.map((s) => ({
        name: s.displayName,
        value: s.name,
      })),
    },
  ]);

  // Collect all stack workflow files
  const stackFiles: string[] = [];
  for (const stackName of selectedStackNames) {
    const workflows = await discoverStackWorkflows(
      REPO_OWNER,
      REPO_NAME,
      DEFAULT_BRANCH,
      stackName
    );
    stackFiles.push(...workflows.map((w) => w.path));
  }

  console.log(
    `\nSelected ${selectedStackNames.length} stack(s) (${stackFiles.length} files)\n`
  );

  // Summary
  const allFiles = [...selectedCore, ...stackFiles];

  const claudeDir = getTargetDirectory(scope, projectRoot, homeDir);
  const rulesDir = `${claudeDir}/rules`;

  console.log("Summary:");
  console.log(`  Total files to install: ${allFiles.length}`);
  console.log(`  Core workflows: ${selectedCore.length}`);
  console.log(`  Stack workflows: ${stackFiles.length}`);
  console.log(`  Target directory: ${rulesDir}`);

  if (dryRun) {
    console.log("\nDry-run mode: No files will be created\n");
  } else {
    console.log("\nInstalling workflow files...\n");
  }

  await ensureDirectory(claudeDir, dryRun, nodeFs, console.log);
  await ensureDirectory(rulesDir, dryRun, nodeFs, console.log);

  // Build raw GitHub URL base
  const rawBaseUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}`;

  // Load existing metadata
  const metadata = await loadMetadata(claudeDir, nodeFs);

  // Download and write each selected file
  let successCount = 0;
  let errorCount = 0;

  for (const filePath of allFiles) {
    try {
      const content = await fetchWorkflowFile(rawBaseUrl, DEFAULT_BRANCH, filePath);
      const fileName = filePath.split("/").pop() || filePath;
      const targetPath = `${rulesDir}/${fileName}`;

      await writeWorkflowFile(targetPath, content, dryRun, nodeFs, console.log);

      // Track file in metadata
      if (!dryRun) {
        addFileToMetadata(metadata, fileName, filePath);
      }

      successCount++;
    } catch (error) {
      console.error(
        `Error installing ${filePath}: ${error instanceof Error ? error.message : String(error)}`
      );
      errorCount++;
    }
  }

  // Save metadata
  if (!dryRun && successCount > 0) {
    await saveMetadata(claudeDir, metadata, nodeFs);
  }

  console.log(`\nInstallation ${dryRun ? "preview" : "complete"}!`);
  console.log(`  Successfully processed: ${successCount}`);
  if (errorCount > 0) {
    console.log(`  Errors: ${errorCount}`);
  }
}
