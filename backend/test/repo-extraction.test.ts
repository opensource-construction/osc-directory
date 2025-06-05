import { describe, it, expect } from 'vitest'
import { cleanGitHubUrl, extractProjectDataFromIssue } from '@helpers/repo-extraction.ts'

describe('cleanGitHubUrl', () => {
  it('cleans a valid GitHub URL', () => {
    const input = 'https://github.com/owner/repo'
    expect(cleanGitHubUrl(input)).toBe('https://github.com/owner/repo')
  })

  it('cleans a GitHub URL with trailing spaces', () => {
    const input = '  https://github.com/owner/repo  '
    expect(cleanGitHubUrl(input)).toBe('https://github.com/owner/repo')
  })

  it('cleans a GitHub URL with additional paths', () => {
    const input = 'https://github.com/owner/repo/tree/main'
    expect(cleanGitHubUrl(input)).toBe('https://github.com/owner/repo')
  })

  it('throws error for invalid GitHub URL', () => {
    expect(() => cleanGitHubUrl('https://invalid.com/owner/repo')).toThrow('Invalid GitHub URL format')
  })
})

describe('extractProjectDataFromIssue', () => {
  it('extracts project data from valid issue body', () => {
    const issueBody = `
### Repository URL
https://github.com/owner/repo

### Category
BIM Tools

### Additional Tags (Optional)
tag1
tag2
    `
    const result = extractProjectDataFromIssue(issueBody)
    expect(result).toEqual({
      url: 'https://github.com/owner/repo',
      category: 'BIM Tools',
      metadata: ['tag1', 'tag2']
    })
  })

  it('handles issue body with no metadata', () => {
    const issueBody = `
### Repository URL
https://github.com/owner/repo

### Category
BIM Tools

### Additional Tags (Optional)
_No response_
    `
    const result = extractProjectDataFromIssue(issueBody)
    expect(result).toEqual({
      url: 'https://github.com/owner/repo',
      category: 'BIM Tools'
    })
  })

  it('cleans and extracts URL from issue body', () => {
    const issueBody = `
### Repository URL
https://github.com/owner/repo/tree/main

### Category
BIM Tools
    `
    const result = extractProjectDataFromIssue(issueBody)
    expect(result.url).toBe('https://github.com/owner/repo')
  })

  it('throws error for missing required fields', () => {
    const issueBody = `
### Repository URL
https://github.com/owner/repo
    `
    expect(() => extractProjectDataFromIssue(issueBody)).toThrow('Missing required fields')
  })
})