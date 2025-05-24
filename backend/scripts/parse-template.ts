import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Project } from '@shared/types/index.ts';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const newProjectPath = path.join(__dirname, '..', "..", 'new-project.yml');
const projectsPath = path.join(__dirname, '..', 'data', 'projects.json');

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

async function processNewProject(): Promise<void> {
  try {
    // Check if the new project file exists
    try {
      await fs.access(newProjectPath);
    } catch (error) {
      console.log('No new-project.yml file found. Creating template.');
      await fs.writeFile(newProjectPath, templateContent);
      return;
    }

    // Read the new project data
    const newProjectData = await fs.readFile(newProjectPath, 'utf8');
    const newProject = yaml.load(newProjectData) as Project;

    // Check if the template has been modified
    if (isTemplateUnchanged(newProject)) {
      console.log('No new project to process - template is unchanged');
      return;
    }

    // Validate the new project data
    if (!isValidProject(newProject)) {
      console.error('Invalid project data. URL and category are required.');
      return;
    }

    // Read existing projects
    try {
      // Check if projects file exists
      await fs.access(projectsPath);
    } catch (error) {
      // If not, create an empty array
      await fs.mkdir(path.dirname(projectsPath), { recursive: true });
      await fs.writeFile(projectsPath, '[]');
    }

    const projectsData = await fs.readFile(projectsPath, 'utf8');
    const projects: Project[] = JSON.parse(projectsData);

    // Check if project with same URL already exists
    if (projects.some(project => project.url === newProject.url)) {
      console.log(`Project with URL ${newProject.url} already exists. Skipping.`);
      return;
    }

    // Add submission date
    const projectToAdd = {
      ...newProject,
      submissionDate: new Date().toISOString().split('T')[0]
    };

    // Add the new project
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

function isTemplateUnchanged(project: Project): boolean {
  // Default values for the template
  const defaultUrl = "https://github.com/username/project";

  return (
    (!project.url || project.url === defaultUrl) &&
    (!project.category || project.category === "") &&
    (!project.metadata || (Array.isArray(project.metadata) && project.metadata.length === 0))
  );
}

function isValidProject(project: Project): boolean {
  const defaultUrl = "https://github.com/username/project";

  return Boolean(
    project.url &&
    project.url !== defaultUrl &&
    project.category &&
    project.category.trim() !== ""
  );
}


processNewProject().catch(error => {
  console.error('Unhandled error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});