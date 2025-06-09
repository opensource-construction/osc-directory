import { Octokit } from "@octokit/rest";
import fs from "fs/promises";
import path from "path";
import { validateRepository, validateNoDuplicates, validateRequiredFields, validateMetadataTags, type MinimalProjectData } from "@helpers/validation.ts";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function validateIssueProject() {
  try {
    // Read the parsed project data
    const projectDataPath = path.join(process.cwd(), "temp-project-data.json");
    const projectData: MinimalProjectData = JSON.parse(await fs.readFile(projectDataPath, "utf-8"));

    console.log("Validating project data:", projectData.url);

    // Validate required fields
    validateRequiredFields(projectData);

    // Validate repository URL and accessibility
    await validateRepository(projectData.url, octokit);

    // Validate for duplicates
    await validateNoDuplicates(projectData.url);

    // Validate field formats
    validateMetadataTags(projectData);

    console.log("✅ Project validation passed!");
  } catch (error) {
    console.error("❌ Project validation failed:", error);
    process.exit(1);
  }
}

validateIssueProject();