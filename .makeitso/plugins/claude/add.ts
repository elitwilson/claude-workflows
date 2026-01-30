// Import shared types and utilities from Make It So
import type { PluginContext } from "../../mis-types.d.ts";
import { mis } from "../../mis-plugin-api.ts";
import { Checkbox } from "https://deno.land/x/cliffy@v1.0.0-rc.4/prompt/mod.ts";
import {
  discoverCoreWorkflows,
  discoverStacks,
  discoverStackWorkflows,
} from "./discovery.ts";
import {
  fetchWorkflowFile,
  ensureDirectory,
  writeWorkflowFile,
} from "./lib.ts";
import { denoFs } from "./deno-fs.ts";

try {
  const ctx: PluginContext = await mis.loadContext();

  console.log("🪄 Add Claude Workflows\n");
  console.log("Discovering available workflows...\n");

  // Extract repo owner and name from config
  const owner = mis.getConfig(ctx, "repo_owner", "elitwilson");
  const repo = mis.getConfig(ctx, "repo_name", "claude-workflows");
  const branch = mis.getConfig(ctx, "default_branch", "main");

  // Discover available workflows
  const coreWorkflows = await discoverCoreWorkflows(owner, repo, branch);
  const availableStacks = await discoverStacks(owner, repo, branch);

  // Select core workflows
  const selectedCoreRaw = await Checkbox.prompt({
    message: "Select core workflows to install:",
    options: coreWorkflows.map((w) => ({ name: w.name, value: w.path })),
  });
  const selectedCore = Array.isArray(selectedCoreRaw)
    ? selectedCoreRaw.map(item => typeof item === 'string' ? item : item.value)
    : [];

  console.log(`\nSelected ${selectedCore.length} core workflow(s)\n`);

  // Select language stacks
  const selectedStackNamesRaw = await Checkbox.prompt({
    message: "Select language stacks to install:",
    options: availableStacks.map((s) => ({ name: s.displayName, value: s.name })),
  });
  const selectedStackNames = Array.isArray(selectedStackNamesRaw)
    ? selectedStackNamesRaw.map(item => typeof item === 'string' ? item : item.value)
    : [];

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

  // Get dry-run flag from context
  const dryRun = ctx.dry_run || false;

  if (dryRun) {
    console.log("\n🔍 Dry-run mode: No files will be created\n");
  } else {
    console.log("\n📦 Installing workflow files...\n");
  }

  // Create directory structure
  const claudeDir = `${ctx.project_root}/.claude`;
  const rulesDir = `${claudeDir}/rules`;

  await ensureDirectory(claudeDir, dryRun, denoFs, console.log);
  await ensureDirectory(rulesDir, dryRun, denoFs, console.log);

  // Build raw GitHub URL base
  const rawBaseUrl = `https://raw.githubusercontent.com/${owner}/${repo}`;

  // Download and write each selected file
  let successCount = 0;
  let errorCount = 0;

  for (const filePath of allFiles) {
    try {
      const content = await fetchWorkflowFile(rawBaseUrl, branch, filePath);
      const fileName = filePath.split("/").pop() || filePath;
      const targetPath = `${rulesDir}/${fileName}`;

      await writeWorkflowFile(targetPath, content, dryRun, denoFs, console.log);
      successCount++;
    } catch (error) {
      console.error(`❌ Error installing ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
      errorCount++;
    }
  }

  console.log(`\n✅ Installation ${dryRun ? "preview" : "complete"}!`);
  console.log(`   Successfully processed: ${successCount}`);
  if (errorCount > 0) {
    console.log(`   Errors: ${errorCount}`);
  }

  mis.outputSuccess({
    message: dryRun ? "Add workflow complete (dry-run)" : "Add workflow complete",
    selected_core: selectedCore,
    selected_stacks: selectedStackNames,
    total_files: allFiles.length,
    successful: successCount,
    errors: errorCount,
    dry_run: dryRun,
  });
} catch (error) {
  mis.outputError(error instanceof Error ? error.message : String(error));
}
