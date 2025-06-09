import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';
import { extractProjectDataFromIssue } from '@helpers/repo-extraction.ts';

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN
});

async function parseIssue() {
	const issueNumber = parseInt(process.env.ISSUE_NUMBER || '0');
	const [owner, repo] = process.env.GITHUB_REPOSITORY?.split('/') || ['', ''];

	try {
		const { data: issue } = await octokit.rest.issues.get({
			owner,
			repo,
			issue_number: issueNumber
		});

		const body = issue.body || '';
		const submitterUsername = issue.user?.login || 'unknown';
		const projectData = extractProjectDataFromIssue(body);
		projectData.submitterUsername = submitterUsername;

		// Save parsed data to temporary file
		await fs.writeFile(
			path.join(process.cwd(), 'temp-project-data.json'),
			JSON.stringify(projectData, null, 2)
		);

		console.log('Issue parsed successfully:', projectData);
	} catch (error) {
		console.error('Error parsing issue:', error);
		process.exit(1);
	}
}

parseIssue();
