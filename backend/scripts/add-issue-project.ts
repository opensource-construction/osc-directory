import fs from "fs/promises";
import path from "path";

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

async function addProjectFromIssue() {
  try {
    // Read the parsed project data
    const projectDataPath = path.join(process.cwd(), "temp-project-data.json");
    const projectData: ProjectData = JSON.parse(await fs.readFile(projectDataPath, "utf-8"));

    console.log("Adding project to projects.json:", projectData.name);

    // Read existing projects
    const projectsPath = path.join(process.cwd(), "../projects.json");
    let projects = [];

    try {
      const existingData = await fs.readFile(projectsPath, "utf-8");
      projects = JSON.parse(existingData);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log("No existing projects.json found, creating new one");
        projects = [];
      } else {
        throw error;
      }
    }

    // Prepare project entry
    const newProject = {
      ...projectData,
      addedAt: new Date().toISOString(),
      source: "issue-submission",
      // These will be populated by update-metadata.ts
      stars: 0,
      forks: 0,
      lastUpdated: null,
      topics: [],
      verified: false
    };

    // Add new project
    projects.push(newProject);

    // Sort projects by name for consistency
    projects.sort((a: any, b: any) => a.name.localeCompare(b.name));

    // Write back to projects.json
    await fs.writeFile(projectsPath, JSON.stringify(projects, null, 2));

    // Clean up temp file
    await fs.unlink(projectDataPath).catch(() => {
      // Ignore if file doesn't exist
    });

    console.log(`✅ Project "${projectData.name}" added successfully to projects.json`);
    console.log(`Total projects: ${projects.length}`);
  } catch (error) {
    console.error("❌ Error adding project:", error);
    process.exit(1);
  }
}

addProjectFromIssue();