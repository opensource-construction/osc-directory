import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Project } from '@shared/types/index.ts';
import yaml from 'js-yaml';
import { predefinedCategories } from "@shared/categories.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const newProjectPath = path.join(__dirname, '..', '..', 'new-project.yml');
const projectsPath = path.join(__dirname, '..', 'data', 'projects.json');

const validateOnly = process.argv.includes('--validate-only');

const templateContent = `# Template for adding a new project to the AEC Open Source Directory
# Please fill in the required information and submit a pull request

# Required: GitHub repository URL
url: https://github.com/username/project

# Required: Choose one category from:
# BIM Tools, Visualization, Analysis, Interoperability, Parametric Design,
# Data Management, Infrastructure, Sustainability, Development Tools, Other
category: Visualization

# Optional: Additional metadata tags
metadata:
  - tag1
  - tag2

`;

const defaultUrl = "https://github.com/username/project";
const githubUrlPattern = /^https:\/\/github\.com\/[^/]+\/[^/]+(\/)?$/;

async function processNewProject(): Promise<void> {
  try {
    // Check if the new project file exists
    if (!(await fileExists(newProjectPath))) {
      console.log('No new-project.yml file found.');
      if (validateOnly) {
        console.error('Error: new-project.yml not found during validation. It might have been deleted or not yet committed.');
        process.exit(1);
      }

      console.log('Creating template for new-project.yml.');
      await fs.writeFile(newProjectPath, templateContent);
      return;
    }

    // Read and parse the new project data
    const newProjectData = await fs.readFile(newProjectPath, 'utf8');
    const newProject = yaml.load(newProjectData) as Project;

    // Check if the template has been modified
    if (isTemplateUnchanged(newProject)) {
      console.log('No new project to process - template is unchanged');
      if (validateOnly) {
        console.log('Validation successful: new-project.yml is the default template.');
        process.exit(0);
      }
      return;
    }

    // Validate the new project data
    const validationErrors = validateProject(newProject);
    if (validationErrors.length > 0) {
      console.error('Validation failed:');
      validationErrors.forEach(error => console.error(`  - ${error}`));
      process.exit(1);
    }

    if (validateOnly) {
      console.log('Validation successful: new-project.yml is valid.');
      process.exit(0);
    }

    // Ensure projects file exists
    await ensureProjectsFileExists();

    // Read existing projects
    const projectsData = await fs.readFile(projectsPath, 'utf8');
    const projects: Project[] = JSON.parse(projectsData);

    // Check for duplicate URLs
    if (projects.some(project => project.url === newProject.url)) {
      console.log(`Project with URL ${newProject.url} already exists. Skipping.`);
      return;
    }

    // Add the new project with submission date
    const projectToAdd: Project = {
      ...newProject,
      submissionDate: new Date().toISOString().split('T')[0]
    };

    projects.push(projectToAdd);

    // Save updated projects file
    await fs.writeFile(projectsPath, JSON.stringify(projects, null, 2));
    console.log('New project added successfully!');

    // Reset the template for next submission
    await fs.writeFile(newProjectPath, templateContent);
    console.log('Template reset for next submission');

  } catch (error) {
    console.error('Error processing new project:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureProjectsFileExists(): Promise<void> {
  if (!(await fileExists(projectsPath))) {
    await fs.mkdir(path.dirname(projectsPath), { recursive: true });
    await fs.writeFile(projectsPath, '[]');
  }
}

function isTemplateUnchanged(project: Project): boolean {
  return (
    (!project.url || project.url === defaultUrl) &&
    (!project.category || project.category === "Visualization") &&
    (!project.metadata || isDefaultMetadata(project.metadata))
  );
}

function isDefaultMetadata(metadata: unknown): boolean {
  return Array.isArray(metadata) &&
    metadata.length === 2 &&
    metadata[0] === 'tag1' &&
    metadata[1] === 'tag2';
}

function validateProject(project: Project): string[] {
  const errors: string[] = [];

  // URL validation
  if (!project.url) {
    errors.push("Project URL is required.");
  } else if (project.url === defaultUrl) {
    errors.push("Project URL must be changed from the default template value.");
  } else if (!githubUrlPattern.test(project.url)) {
    errors.push("Project URL must be a valid GitHub repository URL (e.g., https://github.com/owner/repo).");
  }

  // Category validation
  if (!project.category || project.category.trim() === "") {
    errors.push("Project category is required.");
  } else if (!predefinedCategories.includes(project.category as any)) {
    errors.push(`Invalid category: "${project.category}". Must be one of: ${predefinedCategories.join(', ')}.`);
  }

  // Metadata validation with strict format rules
  if (project.metadata !== undefined) {
    if (!Array.isArray(project.metadata)) {
      errors.push("Metadata must be an array of tags (strings).");
    } else {
      // Check each tag for format compliance
      const invalidTags = project.metadata.filter(tag => {
        // Check if tag is a string
        if (typeof tag !== 'string') return true;

        // Check for empty tags
        if (tag.trim() === "") return true;

        // Check for whitespace
        if (/\s/.test(tag)) return true;

        // Check for valid format (alphanumeric and hyphens only)
        if (!/^[a-zA-Z0-9-]+$/.test(tag)) return true;

        // Check for consecutive hyphens
        if (/--/.test(tag)) return true;

        return false;
      });

      if (invalidTags.length > 0) {
        errors.push(
          "Metadata tags can only contain letters, numbers, and single hyphens as separators. " +
          "No whitespace or special characters allowed. " +
          `Invalid tags: ${invalidTags.map(t => `"${t}"`).join(', ')}`
        );
      }
    }
  }

  return errors;
}

// Run the script
processNewProject().catch(error => {
  console.error('Unhandled error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});