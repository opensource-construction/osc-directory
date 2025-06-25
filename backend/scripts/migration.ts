import fs from 'fs/promises';
import path from 'path';
import { Project } from '@shared/types/index.ts';
import { Octokit } from '@octokit/rest';

interface MigrationConfig {
  name: string;
  version: string;
  description: string;
  dryRun?: boolean;
  createBackup?: boolean;
}

interface MigrationResult {
  success: boolean;
  projectsProcessed: number;
  projectsModified: number;
  errors: string[];
  warnings: string[];
}

abstract class BaseMigration {
  protected config: MigrationConfig;
  protected projectsPath: string;
  protected backupPath: string;

  constructor(config: MigrationConfig) {
    this.config = {
      dryRun: false,
      createBackup: true,
      ...config
    };
    this.projectsPath = path.join(process.cwd(), 'data', 'projects.json');
    this.backupPath = path.join(process.cwd(), 'data', `projects.backup.${Date.now()}.json`);
  }

  // Change migrateProject to return a Promise
  abstract migrateProject(project: Project): Promise<{ modified: boolean; project: Project; warnings?: string[] }>;

  async run(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      projectsProcessed: 0,
      projectsModified: 0,
      errors: [],
      warnings: []
    };

    try {
      console.log(`🚀 Starting migration: ${this.config.name}`);
      console.log(`📝 Description: ${this.config.description}`);
      console.log(`🔧 Version: ${this.config.version}`);
      console.log(`🔍 Dry run: ${this.config.dryRun ? 'YES' : 'NO'}`);

      // Load projects
      const projects = await this.loadProjects();
      result.projectsProcessed = projects.length;

      // Create backup if not dry run
      if (!this.config.dryRun && this.config.createBackup) {
        await this.createBackup(projects);
        console.log(`💾 Backup created: ${this.backupPath}`);
      }

      // Process each project
      const migratedProjects: Project[] = [];
      for (const project of projects) {
        try {
          const migrationResult = await this.migrateProject(project); // Await the async method

          if (migrationResult.modified) {
            result.projectsModified++;
            console.log(`✏️  Modified: ${project.name || project.url}`);

            // Log changes
            console.log('🔄 Changes:');
            console.log('Original:', JSON.stringify(project, null, 2));
            console.log('Updated:', JSON.stringify(migrationResult.project, null, 2));
          }

          if (migrationResult.warnings) {
            result.warnings.push(...migrationResult.warnings);
          }

          migratedProjects.push(migrationResult.project);
        } catch (error) {
          const errorMsg = `Error processing ${project.name || project.url}: ${error}`;
          result.errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
          migratedProjects.push(project); // Keep original on error
        }
      }

      // Save results if not dry run
      if (!this.config.dryRun) {
        await this.saveProjects(migratedProjects);
        console.log(`💾 Projects saved to: ${this.projectsPath}`);
      }

      // Print summary
      this.printSummary(result);
      result.success = true;

    } catch (error) {
      result.errors.push(`Migration failed: ${error}`);
      console.error(`❌ Migration failed:`, error);
    }

    return result;
  }

  private async loadProjects(): Promise<Project[]> {
    try {
      const data = await fs.readFile(this.projectsPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to load projects.json: ${error}`);
    }
  }

  private async createBackup(projects: Project[]): Promise<void> {
    await fs.writeFile(this.backupPath, JSON.stringify(projects, null, 2));
  }

  private async saveProjects(projects: Project[]): Promise<void> {
    await fs.writeFile(this.projectsPath, JSON.stringify(projects, null, 2));
  }

  private printSummary(result: MigrationResult): void {
    console.log('\n📊 Migration Summary:');
    console.log(`   Projects processed: ${result.projectsProcessed}`);
    console.log(`   Projects modified: ${result.projectsModified}`);
    console.log(`   Errors: ${result.errors.length}`);
    console.log(`   Warnings: ${result.warnings.length}`);

    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => console.log(`   - ${error}`));
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      result.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
  }
}

// Example migration: Add contributors count field
class AddContributorsCountMigration extends BaseMigration {
  constructor() {
    super({
      name: 'Add Contributors Count',
      version: '1.0.0',
      description: 'Adds contributorsCount field to all projects (initialized to 0)'
    });
  }

  async migrateProject(project: Project): Promise<{ modified: boolean; project: Project; warnings?: string[] }> {
    // Check if field already exists
    if ('contributorsCount' in project) {
      return { modified: false, project };
    }

    // Add new field
    const migratedProject = {
      ...project,
      contributorsCount: 0
    };

    return {
      modified: true,
      project: migratedProject,
      warnings: [`Added contributorsCount field to ${project.name || project.url}`]
    };
  }
}

// Example migration: Remove deprecated field
class RemoveDeprecatedCategoryMigration extends BaseMigration {
  constructor() {
    super({
      name: 'Remove Deprecated Category',
      version: '1.0.0',
      description: 'Removes the deprecated category field from all projects'
    });
  }

  async migrateProject(project: Project): Promise<{ modified: boolean; project: Project; warnings?: string[] }> {
    // Check if field exists
    if (!('category' in project)) {
      return { modified: false, project };
    }

    // Remove the field
    const { category, ...migratedProject } = project as any;

    return {
      modified: true,
      project: migratedProject,
      warnings: [`Removed category field from ${project.name || project.url}`]
    };
  }
}

class AddForksCountMigration extends BaseMigration {
  private octokit: Octokit;

  constructor() {
    super({
      name: 'Add Forks Count',
      version: '1.1.0',
      description: 'Adds forksCount field to all projects by fetching data from GitHub API'
    });

    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  }

  async fetchForksCount(url: string): Promise<number | null> {
    try {
      // Extract owner and repo from GitHub URL
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) return null;

      const [, owner, repo] = match;
      const repoName = repo.replace(/\.git$/, '');

      const { data: repoData } = await this.octokit.repos.get({
        owner,
        repo: repoName
      });

      return repoData.forks_count || 0;
    } catch (error) {
      console.error(`Error fetching forks count for ${url}:`, error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  async migrateProject(project: Project): Promise<{ modified: boolean; project: Project; warnings?: string[] }> {
    // Check if the field already exists
    if ('forksCount' in project) {
      return { modified: false, project };
    }

    // Fetch forks count from GitHub API
    let forksCount = 0;
    if (project.url && project.url.includes('github.com')) {
      const fetchedForksCount = await this.fetchForksCount(project.url);
      if (fetchedForksCount !== null) {
        forksCount = fetchedForksCount;
      }
    } else if (project.repository && project.repository.includes('github.com')) {
      const fetchedForksCount = await this.fetchForksCount(project.repository);
      if (fetchedForksCount !== null) {
        forksCount = fetchedForksCount;
      }
    }

    // Add the new field
    const migratedProject = {
      ...project,
      forksCount
    };

    return {
      modified: true,
      project: migratedProject,
      warnings: [`Added forksCount field to ${project.name || project.url}`]
    };
  }
}

// Example migration: Transform existing data
class NormalizeTagsMigration extends BaseMigration {
  constructor() {
    super({
      name: 'Normalize Tags',
      version: '1.0.0',
      description: 'Converts all tags to lowercase and removes duplicates'
    });
  }

  async migrateProject(project: Project): Promise<{ modified: boolean; project: Project; warnings?: string[] }> {
    if (!project.tags || project.tags.length === 0) {
      return { modified: false, project };
    }

    const originalTags = project.tags;
    const normalizedTags = [...new Set(
      project.tags
        .map(tag => tag.toLowerCase().trim())
        .filter(tag => tag.length > 0)
    )];

    const modified = JSON.stringify(originalTags) !== JSON.stringify(normalizedTags);

    return {
      modified,
      project: { ...project, tags: normalizedTags },
      warnings: modified ? [`Normalized tags for ${project.name || project.url}`] : undefined
    };
  }
}

// Migration runner script
async function runMigration() {
  const args = process.argv.slice(2);
  const migrationName = args[0];
  const isDryRun = args.includes('--dry-run');

  const migrations = {
    'add-contributors': () => new AddContributorsCountMigration(),
    'remove-category': () => new RemoveDeprecatedCategoryMigration(),
    'normalize-tags': () => new NormalizeTagsMigration(),

  };

  if (!migrationName || !migrations[migrationName as keyof typeof migrations]) {
    console.log('Available migrations:');
    Object.keys(migrations).forEach(name => {
      console.log(`  - ${name}`);
    });
    console.log('\nUsage: tsx migration.ts <migration-name> [--dry-run]');
    process.exit(1);
  }

  const migration = migrations[migrationName as keyof typeof migrations]();

  // Override dry run if specified
  if (isDryRun) {
    (migration as any).config.dryRun = true;
  }

  const result = await migration.run();

  if (!result.success) {
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export { BaseMigration, type MigrationConfig, type MigrationResult };