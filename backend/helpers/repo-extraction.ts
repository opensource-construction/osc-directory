import { MinimalProjectData } from "@helpers/validation.ts";

/**
 * Cleans up a GitHub URL to extract just the base repository URL
 * @param url - The GitHub URL (potentially with additional paths)
 * @returns The cleaned base repository URL
 */
export function cleanGitHubUrl(url: string): string {
  // Remove any trailing whitespace and newlines
  const cleanUrl = url.trim();

  // Check if it's a valid GitHub URL
  const githubPattern = /^https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)/;
  const match = cleanUrl.match(githubPattern);

  if (!match) {
    throw new Error(`Invalid GitHub URL format: ${cleanUrl}`);
  }

  const [, owner, repo] = match;
  return `https://github.com/${owner}/${repo}`;
}

export function extractProjectDataFromIssue(body: string): MinimalProjectData {
  const data: Partial<MinimalProjectData> = {};

  // Parse GitHub issue form format
  const urlMatch = body.match(/### Repository URL\s*\n\s*(.+)/);
  const metadataMatch = body.match(/### Additional Tags \(Optional\)\s*\n([\s\S]*?)(?=###|$)/);

  if (urlMatch) {
    const rawUrl = urlMatch[1].trim();
    data.url = cleanGitHubUrl(rawUrl);

    // Log if URL was cleaned
    if (rawUrl !== data.url) {
      console.log(`[INFO] URL cleaned from: ${rawUrl}`);
      console.log(`[INFO] URL cleaned to: ${data.url}`);
    }
  }

  if (metadataMatch) {
    const metadataText = metadataMatch[1].trim();
    if (metadataText && metadataText !== "_No response_") {
      data.metadata = metadataText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    }
  }


  // Validate required fields
  if (!data.url || !data.category) {
    throw new Error("Missing required fields: url or category");
  }

  return data as MinimalProjectData;
}