import { Octokit } from "@octokit/rest";
import path from "path";
import fs from "fs/promises";

export interface MinimalProjectData {
  url: string;
  category: string;
  metadata?: string[];
}

export interface ValidationOptions {
  /** If true, only allows exact repository URLs without additional paths */
  strictMode?: boolean;
  /** If true, allows forked repositories */
  allowForks?: boolean;
  /** If true, allows archived repositories */
  allowArchived?: boolean;
  /** If true, requires repositories to have a description */
  requireDescription?: boolean;
  /** If true, shows warning messages for issues that don't fail validation */
  showWarnings?: boolean;
}

const defaultValidationOptions: Required<ValidationOptions> = {
  strictMode: false,
  allowForks: false,
  allowArchived: false,
  requireDescription: false,
  showWarnings: true,
};

/**
 * Validates a GitHub repository URL and checks various repository attributes.
 *
 * @param repositoryUrl - The full GitHub repository URL to validate
 * @param octokit - An authenticated Octokit instance to make GitHub API calls
 * @param options - Optional validation configuration settings
 *
 * @returns An object containing repository information:
 * - owner: Repository owner username
 * - repo: Repository name
 * - fullName: Full repository name (owner/repo)
 * - isArchived: Whether the repository is archived
 * - isFork: Whether the repository is a fork
 * - hasDescription: Whether the repository has a description
 *
 * @throws {Error} If:
 * - URL format is invalid (based on strict/non-strict mode)
 * - Repository doesn't exist or isn't accessible
 * - Repository is archived (when allowArchived is false)
 * - Repository is a fork (when allowForks is false)
 * - Repository has no description (when requireDescription is true)
 *
 * @remarks
 * In non-strict mode, URLs with additional paths are allowed and logged as info messages.
 * Warning messages are logged for archived repositories, forks, and missing descriptions when showWarnings is true.
 */
export async function validateRepository(
  repositoryUrl: string,
  octokit: Octokit,
  options: ValidationOptions = {}
) {
  const opts = { ...defaultValidationOptions, ...options };

  // Validate URL format based on strict mode
  if (opts.strictMode) {
    const strictUrlPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/;
    if (!strictUrlPattern.test(repositoryUrl)) {
      throw new Error("Invalid GitHub repository URL format (strict mode)");
    }
  } else {
    // In non-strict mode, allow URLs with additional paths
    const baseUrlPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+/;
    if (!baseUrlPattern.test(repositoryUrl)) {
      throw new Error("Invalid GitHub repository URL format");
    }
  }

  // Extract owner and repo from URL (handle both cases)
  const urlWithoutBase = repositoryUrl.replace('https://github.com/', '');
  const urlParts = urlWithoutBase.split('/');
  const [owner, repo] = urlParts;

  // Validate that we have both owner and repo
  if (!owner || !repo) {
    throw new Error("Could not extract owner and repository name from URL");
  }

  try {
    // Check if repository exists and is accessible
    const { data: repoData } = await octokit.rest.repos.get({
      owner,
      repo,
    });

    // Check if repository is archived
    if (repoData.archived) {
      if (!opts.allowArchived) {
        throw new Error("Repository is archived");
      } else if (opts.showWarnings) {
        console.warn("⚠️ Repository is archived");
      }
    }

    // Check if repository is a fork
    if (repoData.fork) {
      if (!opts.allowForks) {
        throw new Error("Repository is a fork");
      } else if (opts.showWarnings) {
        console.warn("⚠️ Repository is a fork");
      }
    }

    // Check if repository has a description
    if (!repoData.description) {
      if (opts.requireDescription) {
        throw new Error("Repository has no description");
      } else if (opts.showWarnings) {
        console.warn("⚠️ Repository has no description");
      }
    }

    // Log additional info if URL had extra paths
    if (!opts.strictMode && urlParts.length > 2 && opts.showWarnings) {
      console.log(`ℹ️ URL contained additional paths: /${urlParts.slice(2).join('/')}`);
    }

    console.log(`✅ Repository validation passed: ${repoData.full_name}`);

    return {
      owner,
      repo,
      fullName: repoData.full_name,
      isArchived: repoData.archived,
      isFork: repoData.fork,
      hasDescription: !!repoData.description,
    };
  } catch (error: any) {
    if (error.status === 404) {
      throw new Error("Repository not found or not accessible");
    }
    throw new Error(`Failed to validate repository: ${error.message}`);
  }
}

export function validateFieldFormats(projectData: MinimalProjectData) {
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

export function validateRequiredFields(projectData: MinimalProjectData) {
  const requiredFields = ['url'];

  for (const field of requiredFields) {
    if (!projectData[field as keyof MinimalProjectData] || projectData[field as keyof MinimalProjectData] === '') {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

export async function validateNoDuplicates(repositoryUrl: string) {
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