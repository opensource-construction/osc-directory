import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const newProjectPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'new-project.json');

// Define the default template content
const templateContent = {
  "name": "",
  "url": "https://github.com/username/project",
  "description": "",
  "category": "",
  "metadata": []
};

async function resetTemplate(): Promise<void> {
  try {
    // Check if the file exists first
    try {
      await fs.access(newProjectPath);
    } catch (error) {
      console.log('Template file does not exist. Creating new one.');
      // Make sure the directory exists
      const dirPath = path.dirname(newProjectPath);
      await fs.mkdir(dirPath, { recursive: true });
    }

    // Write the default template content
    await fs.writeFile(
      newProjectPath,
      JSON.stringify(templateContent, null, 2)
    );

    console.log('Template file has been reset to default values.');
  } catch (error) {
    console.error('Error resetting template:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run the function
resetTemplate().catch(error => {
  console.error('Unhandled error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});