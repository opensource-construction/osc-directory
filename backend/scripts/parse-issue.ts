import { Octokit } from "@octokit/rest";
import fs from "fs/promises";
import path from "path";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

interface ProjectData {
  name: string;
  repository: string;
  description: string;
  language: string;
  license: string;
  categories: string[];
  tags: string[];
  contact?: string;
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

    // Parse issue body for form data
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
  const lines = body.split('\n');
  const data: Partial<ProjectData> = {};

  // Extract form fields (GitHub issue forms format)
  let currentField = '';
  for (const line of lines) {
    if (line.startsWith('### ')) {
      currentField = line.replace('### ', '').toLowerCase().trim();
    } else if (line.trim() && currentField) {
      switch (currentField) {
        case 'project name':
          data.name = line.trim();
          break;
        case 'repository url':
          data.repository = line.trim();
          break;
        case 'description':
          data.description = line.trim();
          break;
        case 'primary language':
          data.language = line.trim();
          break;
        case 'license':
          data.license = line.trim();
          break;
        case 'categories':
          data.categories = line.split(',').map(cat => cat.trim());
          break;
        case 'tags':
          data.tags = line.split(',').map(tag => tag.trim());
          break;
        case 'contact email':
          data.contact = line.trim();
          break;
      }
    }
  }

  // Validate required fields
  if (!data.name || !data.repository || !data.description) {
    throw new Error("Missing required fields: name, repository, or description");
  }

  return data as ProjectData;
}

parseIssue();