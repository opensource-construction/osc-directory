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

async function validateIssueProject() {
  try {
    // Read the parsed project data
    const projectDataPath = path.join(process.cwd(), "temp-project-data.json");
    const projectData: ProjectData = JSON.parse(await fs.readFile(projectDataPath, "utf-8"));

    console.log("Validating project data:", projectData.name);

    // Validate required fields
    validateRequiredFields(projectData);

    // Validate repository URL and accessibility
    await validateRepository(projectData.repository);

    // Validate for duplicates
    await validateNoDuplicates(projectData);

    // Validate field formats
    validateFieldFormats(projectData);

    console.log("✅ Project validation passed!");
  } catch (error) {
    console.error("❌ Project validation failed:", error);
    process.exit(1);
  }
}

function validateRequiredFields(projectData: ProjectData) {
  const requiredFields = ['name', 'repository', 'description', 'language', 'license'];

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

async function validateNoDuplicates(projectData: ProjectData) {
  try {
    // Check existing projects.json
    const projectsPath = path.join(process.cwd(), "../projects.json");
    const existingData = await fs.readFile(projectsPath, "utf-8");
    const existingProjects = JSON.parse(existingData);

    // Check for duplicate repository URLs
    const duplicateRepo = existingProjects.find((project: any) =>
      project.repository === projectData.repository
    );

    if (duplicateRepo) {
      throw new Error(`Repository already exists in directory: ${projectData.repository}`);
    }

    // Check for duplicate project names (case-insensitive)
    const duplicateName = existingProjects.find((project: any) =>
      project.name.toLowerCase() === projectData.name.toLowerCase()
    );

    if (duplicateName) {
      throw new Error(`Project name already exists: ${projectData.name}`);
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
  // Validate categories
  if (projectData.categories && projectData.categories.length > 0) {
    projectData.categories.forEach(category => {
      if (category.length > 50) {
        throw new Error(`Category too long: ${category}`);
      }
    });
  }

  // Validate tags
  if (projectData.tags && projectData.tags.length > 0) {
    if (projectData.tags.length > 10) {
      throw new Error("Too many tags (maximum 10 allowed)");
    }

    projectData.tags.forEach(tag => {
      if (tag.length > 30) {
        throw new Error(`Tag too long: ${tag}`);
      }
    });
  }

  // Validate email format if provided
  if (projectData.contact) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(projectData.contact)) {
      throw new Error("Invalid email format");
    }
  }

  // Validate name length
  if (projectData.name.length > 100) {
    throw new Error("Project name too long (maximum 100 characters)");
  }

  // Validate description length
  if (projectData.description.length > 500) {
    throw new Error("Description too long (maximum 500 characters)");
  }

  console.log("✅ Field format validation passed");
}

validateIssueProject();