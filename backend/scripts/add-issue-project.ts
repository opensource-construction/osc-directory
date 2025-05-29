import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';

// Get the correct directory path like in parse-template.ts
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ProjectData {
  url: string;
  category: string;
  metadata?: string[];
}

async function addProjectFromIssue() {
  try {
    // Read the parsed project data
    const projectDataPath = path.join(process.cwd(), "temp-project-data.json");
    const projectData: ProjectData = JSON.parse(await fs.readFile(projectDataPath, "utf-8"));

    console.log("Adding project to projects.json:", projectData.url);

    // Use the same path structure as parse-template.ts
    const projectsPath = path.join(__dirname, '..', 'data', 'projects.json');
    let projects = [];

    try {
      const existingData = await fs.readFile(projectsPath, "utf-8");
      projects = JSON.parse(existingData);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log("No existing projects.json found, creating new one");
        // Ensure the data directory exists
        await fs.mkdir(path.dirname(projectsPath), { recursive: true });
        projects = [];
      } else {
        throw error;
      }
    }

    // Create minimal project entry - update-metadata.ts will fetch the rest
    const newProject = {
      url: projectData.url,
      category: projectData.category,
      metadata: projectData.metadata || [],
      // These will be populated by update-metadata.ts
      name: "",
      description: "",
      stars: 0,
      forks: 0,
      lastUpdated: "",
      mainLanguage: null,
      license: "",
      topics: [],
      submissionDate: new Date().toISOString().split('T')[0]
    };

    // Add new project
    projects.push(newProject);

    // Write back to projects.json
    await fs.writeFile(projectsPath, JSON.stringify(projects, null, 2));

    // Clean up temp file
    await fs.unlink(projectDataPath).catch(() => { });

    console.log(`✅ Project "${projectData.url}" added successfully to projects.json`);
    console.log(`📁 File saved to: ${projectsPath}`);
    console.log("📡 Metadata will be fetched by update-metadata.ts");
  } catch (error) {
    console.error("❌ Error adding project:", error);
    process.exit(1);
  }
}

addProjectFromIssue();