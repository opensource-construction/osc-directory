import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Project } from '../src/lib/types/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const newProjectPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'new-project.json');
const projectsPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'projects.json');
const templateContent = {
  "url": "https://github.com/username/project",
  "description": "",
  "category": "",
  "metadata": []
};

async function processNewProject(): Promise<void> {
  try {
    // Read the new project data
    const newProjectData = await fs.readFile(newProjectPath, 'utf8');
    const newProject = JSON.parse(newProjectData) as Project;

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

    // Reset the template
    await fs.writeFile(newProjectPath, JSON.stringify(templateContent, null, 2));
    console.log('Template reset for next submission');
  } catch (error) {
    console.error('Error processing new project:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

function isTemplateUnchanged(project: Project): boolean {
  // Check if any meaningful changes were made to the template
  return (
    (project.url === templateContent.url || !project.url) &&
    (project.description === templateContent.description || !project.description) &&
    (project.category === templateContent.category || !project.category) &&
    (Array.isArray(project.metadata) && project.metadata.length === 0)
  );
}

function isValidProject(project: Project): boolean {
  // Minimum requirements: URL and category
  return Boolean(
    project.url &&
    project.url !== templateContent.url &&
    project.category
  );
}

// Run the function
processNewProject().catch(error => {
  console.error('Unhandled error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});