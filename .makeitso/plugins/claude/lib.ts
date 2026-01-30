/**
 * FileSystem abstraction for cross-runtime compatibility
 * Implementations: deno-fs.ts (Deno), node-fs.ts (Node.js/npx)
 */
export interface FileSystem {
  mkdir(path: string, recursive: boolean): Promise<void>;
  exists(path: string): Promise<boolean>;
  writeFile(path: string, content: string): Promise<void>;
  readFile(path: string): Promise<string>;
}

/**
 * Logger function type
 */
export type LogFn = (message: string) => void;

/**
 * Fetches a workflow file from the GitHub repository
 */
export async function fetchWorkflowFile(
  repoUrl: string,
  branch: string,
  filePath: string
): Promise<string> {
  const url = `${repoUrl}/${branch}/${filePath}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${filePath}: HTTP ${response.status} ${response.statusText}`
      );
    }

    return await response.text();
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Failed to fetch")) {
      throw error;
    }
    throw new Error(
      `Failed to fetch ${filePath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Ensures a directory exists, creating it if necessary
 * Portable - works with any FileSystem implementation
 */
export async function ensureDirectory(
  path: string,
  dryRun: boolean,
  fs: FileSystem,
  log: LogFn
): Promise<void> {
  if (dryRun) {
    log(`Would create directory: ${path}`);
    return;
  }

  const dirExists = await fs.exists(path);
  if (!dirExists) {
    await fs.mkdir(path, true);
    log(`Created directory: ${path}`);
  }
}

/**
 * Writes a workflow file to the specified path
 * Portable - works with any FileSystem implementation
 */
export async function writeWorkflowFile(
  path: string,
  content: string,
  dryRun: boolean,
  fs: FileSystem,
  log: LogFn
): Promise<void> {
  if (dryRun) {
    log(`Would write file: ${path}`);
    return;
  }

  await fs.writeFile(path, content);
  log(`Wrote file: ${path}`);
}
