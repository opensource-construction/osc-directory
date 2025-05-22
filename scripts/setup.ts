import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Define types for package.json
interface PackageJson {
	name?: string;
	version?: string;
	dependencies: Record<string, string>;
	devDependencies?: Record<string, string>;
	scripts?: Record<string, string>;
	[key: string]: unknown;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

async function setupProject(): Promise<void> {
	console.log('Setting up AEC Open Source Directory...');

	// Add dependencies to package.json
	const packageJsonPath = path.join(rootDir, 'package.json');

	try {
		const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
		const packageJson = JSON.parse(packageJsonContent) as PackageJson;

		// Add Octokit for GitHub API calls
		if (!packageJson.dependencies) {
			packageJson.dependencies = {};
		}

		packageJson.dependencies['@octokit/rest'] = '^20.0.1';

		// Write updated package.json
		await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
		console.log('Updated package.json with new dependencies');

		// Install dependencies
		console.log('Installing dependencies...');
		execSync('pnpm install', {
			cwd: rootDir,
			stdio: 'inherit'
		});

		// Create license file if it doesn't exist
		const licensePath = path.join(rootDir, 'LICENSE');
		try {
			await fs.access(licensePath);
			console.log('LICENSE file already exists');
		} catch (error) {
			// Create MIT license
			const licenseContent = `MIT License

Copyright (c) ${new Date().getFullYear()} AEC Open Source Directory

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

			await fs.writeFile(licensePath, licenseContent);
			console.log('Created LICENSE file');
		}

		console.log('\nSetup completed successfully!');
		console.log('\nTo start development server:');
		console.log('  pnpm dev');
		console.log('\nTo add a new project:');
		console.log('  pnpm add-project');
		console.log('\nTo update metadata:');
		console.log('  pnpm update-metadata');
	} catch (error) {
		console.error('Error setting up project:', error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}

// Execute the setup function
setupProject().catch(error => {
	console.error('Unhandled error during setup:', error instanceof Error ? error.message : String(error));
	process.exit(1);
});