import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Octokit } from '@octokit/rest';
import {
	validateRepository,
	validateTags,
	validateRequiredFields,
	validateNoDuplicates
} from '@helpers/validation.ts';
import fs from 'fs/promises';

vi.mock('fs/promises');
vi.mock('path');

describe('validateRepository', () => {
	let mockOctokit: { rest: { repos: { get: any } } };

	beforeEach(() => {
		mockOctokit = {
			rest: {
				repos: {
					get: vi.fn()
				}
			}
		};
	});

	it('validates a valid repository URL in strict mode', async () => {
		mockOctokit.rest.repos.get.mockResolvedValueOnce({
			data: {
				full_name: 'owner/repo',
				archived: false,
				fork: false,
				description: 'test description'
			}
		});

		const result = await validateRepository(
			'https://github.com/owner/repo',
			mockOctokit as unknown as Octokit,
			{ strictMode: true }
		);

		expect(result).toEqual({
			owner: 'owner',
			repo: 'repo',
			fullName: 'owner/repo',
			isArchived: false,
			isFork: false,
			hasDescription: true
		});
	});

	it('throws error for invalid URL format in strict mode', async () => {
		await expect(
			validateRepository(
				'https://github.com/owner/repo/tree/main',
				mockOctokit as unknown as Octokit,
				{ strictMode: true }
			)
		).rejects.toThrow('Invalid GitHub repository URL format (strict mode)');
	});

	it('throws error when repository is archived and not allowed', async () => {
		mockOctokit.rest.repos.get.mockResolvedValueOnce({
			data: {
				archived: true
			}
		});

		await expect(
			validateRepository('https://github.com/owner/repo', mockOctokit as unknown as Octokit, {
				allowArchived: false
			})
		).rejects.toThrow('Repository is archived');
	});
});

describe('validateFieldFormats', () => {
	it('validates correct  tags', () => {
		const validProject = {
			url: 'https://github.com/owner/repo',
			tags: ['tag1', 'tag2']
		};

		expect(() => validateTags(validProject)).not.toThrow();
	});

	it('throws error for too many tags', () => {
		const projectWithTooManyTags = {
			url: 'https://github.com/owner/repo',
			tags: Array(11).fill('tag')
		};

		expect(() => validateTags(projectWithTooManyTags)).toThrow('Too many tags');
	});
});

describe('validateRequiredFields', () => {
	it('validates project with all required fields', () => {
		const validProject = {
			url: 'https://github.com/owner/repo'
		};

		expect(() => validateRequiredFields(validProject)).not.toThrow();
	});

	it('throws error for missing url', () => {
		const invalidProject = {
			url: ''
		};

		expect(() => validateRequiredFields(invalidProject)).toThrow('Missing required field: url');
	});
});

describe('validateNoDuplicates', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('passes when no duplicates found', async () => {
		vi.mocked(fs.readFile).mockResolvedValueOnce(
			JSON.stringify([{ url: 'https://github.com/other/repo' }])
		);

		await expect(validateNoDuplicates('https://github.com/owner/repo')).resolves.not.toThrow();
	});

	it('throws error when duplicate found', async () => {
		const repoUrl = 'https://github.com/owner/repo';
		vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify([{ url: repoUrl }]));

		await expect(validateNoDuplicates(repoUrl)).rejects.toThrow('Repository already exists');
	});

	it('handles missing projects file', async () => {
		vi.mocked(fs.readFile).mockRejectedValueOnce({ code: 'ENOENT' });

		await expect(validateNoDuplicates('https://github.com/owner/repo')).resolves.not.toThrow();
	});
});
