import { describe, it, expect } from 'vitest';
import { extractProjectDataFromIssue } from '@helpers/repo-extraction.ts';

describe('extractProjectDataFromIssue', () => {
  it('extracts project data from valid issue body', () => {
    const issueBody = `
### Repository URL
https://github.com/owner/repo

### Additional Tags (Optional)
tag1
tag2
    `;
    const result = extractProjectDataFromIssue(issueBody);
    expect(result).toEqual({
      url: 'https://github.com/owner/repo',
      tags: ['tag1', 'tag2']
    });
  });

  it('handles issue body with no tags', () => {
    const issueBody = `
### Repository URL
https://github.com/owner/repo

### Additional Tags (Optional)
_No response_
    `;
    const result = extractProjectDataFromIssue(issueBody);
    expect(result).toEqual({
      url: 'https://github.com/owner/repo'
    });
  });

  it('cleans and extracts URL from issue body', () => {
    const issueBody = `
### Repository URL
https://github.com/owner/repo/tree/main

    `;
    const result = extractProjectDataFromIssue(issueBody);
    expect(result.url).toBe('https://github.com/owner/repo');
  });

  it('extracts project data with minimal required fields', () => {
    const issueBody = `
### Repository URL
https://github.com/owner/repo
    `;
    const result = extractProjectDataFromIssue(issueBody);
    expect(result).toEqual({
      url: 'https://github.com/owner/repo'
    });
  });

  it('throws error for missing repository URL', () => {
    const issueBody = `
### Additional Tags (Optional)
tag1
tag2
    `;
    expect(() => extractProjectDataFromIssue(issueBody)).toThrow('Repository URL is required');
  });
});
