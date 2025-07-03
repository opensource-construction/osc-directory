import { BaseProjectData } from '../../shared/types/index.js';
import type { PlatformTag, FrameworkTag } from '../../shared/types/index.js';

/**
 * Cleans up a GitHub URL to extract just the base repository URL
 * @param url - The GitHub URL (potentially with additional paths)
 * @returns The cleaned base repository URL
 */
export function cleanGitHubUrl(url: string): string {
	// Remove any trailing whitespace and newlines
	const cleanUrl = url.trim();

	// Check if it's a valid GitHub URL
	const githubPattern = /^https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)/;
	const match = cleanUrl.match(githubPattern);

	if (!match) {
		throw new Error(`Invalid GitHub URL format: ${cleanUrl}`);
	}

	const [, owner, repo] = match;
	return `https://github.com/${owner}/${repo}`;
}

export function extractProjectDataFromIssue(body: string): BaseProjectData {
	const data: Partial<BaseProjectData> = {};

	// Parse GitHub issue form format
	const urlMatch = body.match(/### Repository URL\s*\n\s*(.+)/);
	const tagMatch = body.match(/### Additional Tags \(Optional\)\s*\n([\s\S]*?)(?=###|$)/);
	const platformMatch = body.match(/### Compatible Platforms\s*\n([\s\S]*?)(?=###|$)/);
	const frameworkMatch = body.match(/### Frameworks Used \(Optional\)\s*\n([\s\S]*?)(?=###|$)/);

	if (urlMatch) {
		const rawUrl = urlMatch[1].trim();
		data.url = cleanGitHubUrl(rawUrl);

		// Log if URL was cleaned
		if (rawUrl !== data.url) {
			console.log(`[INFO] URL cleaned from: ${rawUrl}`);
			console.log(`[INFO] URL cleaned to: ${data.url}`);
		}
	}

	if (tagMatch) {
		const tagText = tagMatch[1].trim();
		if (tagText && tagText !== '_No response_') {
			data.tags = tagText
				.split('\n')
				.map((line) => line.trim())
				.filter((line) => line.length > 0);
		}
	}

	// Extract platforms
	if (platformMatch) {
		const platformText = platformMatch[1].trim();
		if (platformText && platformText !== '_No response_') {
			data.platforms = platformText
				.split('\n')
				.map((line) => line.trim())
				.filter((line) => line.length > 0) as PlatformTag[];
		}
	}

	// Extract frameworks
	if (frameworkMatch) {
		const frameworkText = frameworkMatch[1].trim();
		if (frameworkText && frameworkText !== '_No response_') {
			data.frameworks = frameworkText
				.split('\n')
				.map((line) => line.trim())
				.filter((line) => line.length > 0) as FrameworkTag[];
		}
	}

	// Validate required fields
	if (!data.url) {
		throw new Error('Repository URL is required');
	}

	return data as BaseProjectData;
}
