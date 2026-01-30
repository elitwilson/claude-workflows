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
