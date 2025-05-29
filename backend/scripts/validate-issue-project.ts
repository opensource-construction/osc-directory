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

async function validateIssueProject() {
  try {
    // Read the parsed project data
    const projectDataPath = path.join(process.cwd(), "temp-project-data.json");
    const projectData: ProjectData = JSON.parse(await fs.readFile(projectDataPath, "utf-8"));

    console.log("Validating project data:", projectData.url);

    // Validate required fields
    validateRequiredFields(projectData);

    // Validate repository URL and accessibility
    await validateRepository(projectData.url);

    // Validate for duplicates
    await validateNoDuplicates(projectData.url);

    // Validate field formats
    validateFieldFormats(projectData);

    console.log("✅ Project validation passed!");
  } catch (error) {
    console.error("❌ Project validation failed:", error);
    process.exit(1);
  }
}

function validateRequiredFields(projectData: ProjectData) {
  const requiredFields = ['url', 'category'];

  for (const field of requiredFields) {
    if (!projectData[field as keyof ProjectData] || projectData[field as keyof ProjectData] === '') {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

async function validateRepository(repositoryUrl: string) {
  // Validate URL format
  const urlPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;
  if (!urlPattern.test(repositoryUrl)) {
    throw new Error("Invalid GitHub repository URL format");
  }

  // Extract owner and repo from URL
  const urlParts = repositoryUrl.replace('https://github.com/', '').split('/');
  const [owner, repo] = urlParts;

  try {
    // Check if repository exists and is accessible
    const { data: repoData } = await octokit.rest.repos.get({
      owner,
      repo,
    });

    // Check if repository is not archived
    if (repoData.archived) {
      throw new Error("Repository is archived");
    }

    // Check if repository is not a fork (optional - you might want to allow forks)
    if (repoData.fork) {
      console.warn("⚠️ Repository is a fork");
    }

    // Check if repository has a description
    if (!repoData.description) {
      console.warn("⚠️ Repository has no description");
    }

    console.log(`✅ Repository validation passed: ${repoData.full_name}`);
  } catch (error: any) {
    if (error.status === 404) {
      throw new Error("Repository not found or not accessible");
    }
    throw new Error(`Failed to validate repository: ${error.message}`);
  }
}

async function validateNoDuplicates(repositoryUrl: string) {
  try {
    // Check existing projects.json
    const projectsPath = path.join(process.cwd(), "../data/projects.json");
    const existingData = await fs.readFile(projectsPath, "utf-8");
    const existingProjects = JSON.parse(existingData);

    // Check for duplicate repository URLs
    const duplicateRepo = existingProjects.find((project: any) =>
      project.url === repositoryUrl
    );

    if (duplicateRepo) {
      throw new Error(`Repository already exists in directory: ${repositoryUrl}`);
    }

    console.log("✅ No duplicates found");
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log("No existing projects.json found - skipping duplicate check");
    } else {
      throw error;
    }
  }
}

function validateFieldFormats(projectData: ProjectData) {
  // Validate category is from allowed list
  const allowedCategories = [
    'BIM Tools', 'Visualization', 'Analysis', 'Interoperability',
    'Parametric Design', 'Data Management', 'Infrastructure',
    'Sustainability', 'Development Tools', 'Other'
  ];

  if (!allowedCategories.includes(projectData.category)) {
    throw new Error(`Invalid category: ${projectData.category}`);
  }

  // Validate metadata tags
  if (projectData.metadata && projectData.metadata.length > 0) {
    if (projectData.metadata.length > 10) {
      throw new Error("Too many metadata tags (maximum 10 allowed)");
    }

    projectData.metadata.forEach(tag => {
      if (tag.length > 30) {
        throw new Error(`Metadata tag too long: ${tag}`);
      }
      if (tag.trim() !== tag) {
        throw new Error(`Metadata tag has leading/trailing spaces: "${tag}"`);
      }
    });
  }

  console.log("✅ Field format validation passed");
}

validateIssueProject();