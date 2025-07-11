import { describe, it, expect } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractProjectDataFromIssue } from '@helpers/repo-extraction.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadTestCase(filename: string): Promise<string> {
  const filePath = path.join(__dirname, 'issue-examples', filename);
  return await fs.readFile(filePath, 'utf8');
}

describe('Issue Parsing with MD Files', () => {
  describe('Valid Cases', () => {
    it('should parse valid-complete.md', async () => {
      const issueBody = await loadTestCase('valid-complete.md');
      const result = extractProjectDataFromIssue(issueBody);

      expect(result.url).toBe('https://github.com/mmolero/awesome-point-cloud-processing');
      expect(result.tags).toEqual(['test-tag1', 'test-tag2']);
      expect(result.platforms).toEqual(['mobile', 'cloud', 'desktop']);
      expect(result.frameworks).toEqual(['wpf', 'dotnet']);
    });
  });

  describe('Valid Minimal', () => {
    it('should parse valid-complete.md', async () => {
      const issueBody = await loadTestCase('valid-minimal.md');
      const result = extractProjectDataFromIssue(issueBody);

      expect(result.url).toBe('https://github.com/mmolero/awesome-point-cloud-processing');
      expect(result.tags).toEqual(undefined);
      expect(result.platforms).toEqual(undefined);
      expect(result.frameworks).toEqual(undefined);
    });
  });
});