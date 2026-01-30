// Import shared types and utilities from Make It So
import type { PluginContext } from "../../mis-types.d.ts";
import { mis } from "../../mis-plugin-api.ts";
import { Checkbox } from "https://deno.land/x/cliffy@v1.0.0-rc.4/prompt/mod.ts";
import {
  discoverCoreWorkflows,
  discoverStacks,
  discoverStackWorkflows,
} from "./discovery.ts";

try {
  const ctx: PluginContext = await mis.loadContext();

  console.log("🪄 Claude Workflows Setup\n");
  console.log("Discovering available workflows...\n");

  // Extract repo owner and name from config
  const owner = mis.getConfig(ctx, "repo_owner", "elitwilson");
  const repo = mis.getConfig(ctx, "repo_name", "claude-workflows");
  const branch = mis.getConfig(ctx, "default_branch", "main");

  // Discover available workflows
  const coreWorkflows = await discoverCoreWorkflows(owner, repo, branch);
  const availableStacks = await discoverStacks(owner, repo, branch);

  // Select core workflows
  const selectedCore = await Checkbox.prompt({
    message: "Select core workflows to install:",
    options: coreWorkflows.map((w) => ({ name: w.name, value: w.path })),
    default: coreWorkflows.map((w) => w.path), // All selected by default
  });

  console.log(`\nSelected ${selectedCore.length} core workflow(s)\n`);

  // Select language stacks
  const selectedStackNames = await Checkbox.prompt({
    message: "Select language stacks to install:",
    options: availableStacks.map((s) => ({ name: s.displayName, value: s.name })),
  });

  // Collect all stack workflow files
  const stackFiles: string[] = [];
  for (const stackName of selectedStackNames) {
    const workflows = await discoverStackWorkflows(owner, repo, branch, stackName);
    stackFiles.push(...workflows.map((w) => w.path));
  }

  console.log(`\nSelected ${selectedStackNames.length} stack(s) (${stackFiles.length} files)\n`);

  // Summary
  const allFiles = [...selectedCore, ...stackFiles];
  console.log("📋 Summary:");
  console.log(`  Total files to install: ${allFiles.length}`);
  console.log(`  Core workflows: ${selectedCore.length}`);
  console.log(`  Stack workflows: ${stackFiles.length}`);
  console.log(`  Target directory: ${ctx.project_root}/.claude/rules/`);

  console.log("\n🚧 POC: File installation not implemented yet\n");
  console.log("Selected files:");
  allFiles.forEach((file) => console.log(`  - ${file}`));

  mis.outputSuccess({
    message: "Init workflow complete (POC)",
    selected_core: selectedCore,
    selected_stacks: selectedStackNames,
    total_files: allFiles.length,
  });
} catch (error) {
  mis.outputError(error instanceof Error ? error.message : String(error));
}
