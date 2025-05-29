import { Octokit } from "@octokit/rest";
import fs from "fs/promises";
import path from "path";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

interface ProjectData {
  url: string;
  category: string;
  metadata?: string[];
}

async function parseIssue() {
  const issueNumber = parseInt(process.env.ISSUE_NUMBER || "0");
  const [owner, repo] = process.env.GITHUB_REPOSITORY?.split("/") || ["", ""];

  try {
    const { data: issue } = await octokit.rest.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });

    const body = issue.body || "";
    const projectData = extractProjectDataFromIssue(body);

    // Save parsed data to temporary file
    await fs.writeFile(
      path.join(process.cwd(), "temp-project-data.json"),
      JSON.stringify(projectData, null, 2)
    );

    console.log("Issue parsed successfully:", projectData);
  } catch (error) {
    console.error("Error parsing issue:", error);
    process.exit(1);
  }
}

function extractProjectDataFromIssue(body: string): ProjectData {
  const data: Partial<ProjectData> = {};

  // Parse GitHub issue form format
  const urlMatch = body.match(/### Repository URL\s*\n\s*(.+)/);
  const categoryMatch = body.match(/### Category\s*\n\s*(.+)/);
  const metadataMatch = body.match(/### Additional Tags \(Optional\)\s*\n([\s\S]*?)(?=###|$)/);

  if (urlMatch) {
    data.url = urlMatch[1].trim();
  }

  if (categoryMatch) {
    data.category = categoryMatch[1].trim();
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

  return data as ProjectData;
}

parseIssue();