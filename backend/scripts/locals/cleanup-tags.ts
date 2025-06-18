import fs from 'fs';
import path from 'path';

interface Project {
  name: string;
  description: string;
  url: string;
  tags?: string[];
  topics?: string[];
  category?: string;
  metadata?: {
    tags?: string[];
    topics?: string[];
    category?: string;
    mainLanguage?: string;
    license?: string;
    [key: string]: any;
  };
}

interface CleanupConfig {
  mergeSynonyms: boolean;
  addLanguageAsTag: boolean;
  minTagLength: number;
  maxTagLength: number;
  blacklistedTags: string[];
  synonymMap: Record<string, string>;
}

const defaultConfig: CleanupConfig = {
  mergeSynonyms: true,
  addLanguageAsTag: false,
  minTagLength: 2,
  maxTagLength: 50,
  blacklistedTags: ['misc', 'other', 'general', 'tool', 'software'],
  synonymMap: {
    'javascript': 'js',
    'typescript': 'ts',
    'python3': 'python',
    'cpp': 'c++',
    'csharp': 'c#',
    'autocad': 'dwg',
    'building-information-modeling': 'bim',
    'computer-aided-design': 'cad',
    'finite-element-analysis': 'fea',
    'architectural': 'architecture',
    'structural': 'structure',
    'mechanical': 'mech',
    'electrical': 'electric',
    // Category normalization
    'cad-software': 'cad',
    'bim-software': 'bim',
    'analysis-software': 'analysis',
    'visualization': 'viz',
    'documentation': 'docs'
  }
};

function cleanupTags(config: CleanupConfig = defaultConfig) {
  const projectsPath = path.join(process.cwd(), 'data', 'projects.json');

  if (!fs.existsSync(projectsPath)) {
    console.error('❌ projects.json not found');
    process.exit(1);
  }

  const projects: Project[] = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'));

  console.log(`🔄 Processing ${projects.length} projects...`);

  let changesCount = 0;
  const categoryStats = new Map<string, number>();

  const processedProjects = projects.map(project => {
    const consolidatedTags = new Set<string>();
    let hasChanges = false;

    // Collect tags from all sources
    const tagSources = [
      project.tags || [],
      project.topics || [],
      project.metadata?.tags || [],
      project.metadata?.topics || []
    ];

    tagSources.forEach(source => {
      if (Array.isArray(source)) {
        source.forEach(tag => {
          if (tag && typeof tag === 'string') {
            consolidatedTags.add(tag.toLowerCase().trim());
          }
        });
      }
    });

    // Add category as tag (from both direct property and metadata)
    const categories = [
      project.category,
      project.metadata?.category
    ].filter(Boolean);

    categories.forEach(category => {
      if (category) {
        const normalizedCategory = category.toLowerCase().trim();
        consolidatedTags.add(normalizedCategory);
        categoryStats.set(category, (categoryStats.get(category) || 0) + 1);
        hasChanges = true;
      }
    });

    // Add language as tag if enabled
    if (config.addLanguageAsTag && project.metadata?.mainLanguage) {
      consolidatedTags.add(project.metadata.mainLanguage.toLowerCase().trim());
    }

    // Clean and normalize tags
    const cleanTags = Array.from(consolidatedTags)
      .map(tag => normalizeTag(tag, config))
      .filter(tag => isValidTag(tag, config))
      .map(tag => applySynonyms(tag, config))
      .filter((tag, index, arr) => arr.indexOf(tag) === index) // Remove duplicates after synonym mapping
      .sort();

    if (hasChanges || cleanTags.length !== (project.tags?.length || 0) || project.category || project.metadata?.category) {
      changesCount++;
      console.log(`📝 Processing: ${project.name}`);
      if (categories.length > 0) {
        console.log(`   🏷️  Category → Tag: ${categories.join(', ')}`);
      }
      console.log(`   📊 Final tags (${cleanTags.length}): ${cleanTags.slice(0, 5).join(', ')}${cleanTags.length > 5 ? '...' : ''}`);
    }

    // Create cleaned project (remove category fields)
    const cleanedProject: any = {
      name: project.name,
      description: project.description,
      url: project.url,
      tags: cleanTags
    };

    // Preserve metadata (excluding tags/topics/category)
    if (project.metadata) {
      const cleanedMetadata = { ...project.metadata };
      delete cleanedMetadata.tags;
      delete cleanedMetadata.topics;
      delete cleanedMetadata.category; // Remove category from metadata

      if (Object.keys(cleanedMetadata).length > 0) {
        cleanedMetadata.metadata = cleanedMetadata;
      }
    }

    return cleanedProject;
  });

  // Create backup
  const backupPath = projectsPath.replace('.json', `.backup.${Date.now()}.json`);
  fs.writeFileSync(backupPath, fs.readFileSync(projectsPath));
  console.log(`💾 Backup created: ${backupPath}`);

  // Write cleaned data
  fs.writeFileSync(projectsPath, JSON.stringify(processedProjects, null, 2));

  console.log(`✅ Cleanup complete!`);
  console.log(`   - Processed ${projects.length} projects`);
  console.log(`   - Modified ${changesCount} projects`);
  console.log(`   - Removed all category fields`);
  console.log(`   - Added categories as tags`);

  generateReport(processedProjects, categoryStats);
}

function normalizeTag(tag: string, config: CleanupConfig): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, config.maxTagLength);
}

function isValidTag(tag: string, config: CleanupConfig): boolean {
  return tag.length >= config.minTagLength &&
    tag.length <= config.maxTagLength &&
    !config.blacklistedTags.includes(tag);
}

function applySynonyms(tag: string, config: CleanupConfig): string {
  if (config.mergeSynonyms && config.synonymMap[tag]) {
    return config.synonymMap[tag];
  }
  return tag;
}

function generateReport(projects: Project[], categoryStats: Map<string, number>) {
  const tagCounts = new Map<string, number>();
  const languageCounts = new Map<string, number>();

  projects.forEach(project => {
    // Count tags
    if (project.tags) {
      project.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    }

    // Count languages
    if (project.metadata?.mainLanguage) {
      const lang = project.metadata.mainLanguage;
      languageCounts.set(lang, (languageCounts.get(lang) || 0) + 1);
    }
  });

  console.log('\n📊 Cleanup Report:');
  console.log(`   Total projects: ${projects.length}`);
  console.log(`   Total unique tags: ${tagCounts.size}`);
  console.log(`   Average tags per project: ${(Array.from(tagCounts.values()).reduce((a, b) => a + b, 0) / projects.length).toFixed(1)}`);

  if (categoryStats.size > 0) {
    console.log('\n🏷️  Categories converted to tags:');
    Array.from(categoryStats.entries())
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   ${category}: ${count} projects`);
      });
  }

  console.log('\n🔥 Top 20 Tags:');
  Array.from(tagCounts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .forEach(([tag, count]) => {
      console.log(`   ${tag}: ${count} projects`);
    });

  if (languageCounts.size > 0) {
    console.log('\n💻 Top Languages:');
    Array.from(languageCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([lang, count]) => {
        console.log(`   ${lang}: ${count} projects`);
      });
  }

  // Find potential issues
  console.log('\n⚠️  Potential Issues:');
  const singleCharTags = Array.from(tagCounts.keys()).filter(tag => tag.length === 1);
  if (singleCharTags.length > 0) {
    console.log(`   Single character tags: ${singleCharTags.join(', ')}`);
  }

  const longTags = Array.from(tagCounts.keys()).filter(tag => tag.length > 30);
  if (longTags.length > 0) {
    console.log(`   Long tags (>30 chars): ${longTags.slice(0, 5).join(', ')}`);
  }
}

// Dry run function to preview changes
function dryRun() {
  const projectsPath = path.join(process.cwd(), 'data', 'projects.json');
  const projects: Project[] = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'));

  console.log('🔍 DRY RUN - Preview of changes:');

  const categoriesToRemove = new Set<string>();

  projects.forEach(project => {
    const categories = [project.category, project.metadata?.category].filter(Boolean);

    if (categories.length > 0) {
      console.log(`\n📝 ${project.name}:`);
      console.log(`   Will remove categories: ${categories.join(', ')}`);
      console.log(`   Will add to tags: ${categories.map(c => c?.toLowerCase().trim()).join(', ')}`);
    }

    categories.forEach(cat => cat && categoriesToRemove.add(cat));
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Categories to remove: ${categoriesToRemove.size}`);
  console.log(`   Projects affected: ${projects.filter(p => p.category || p.metadata?.category).length}`);
  console.log(`   Categories: ${Array.from(categoriesToRemove).join(', ')}`);
}

// CLI interface
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  const args = process.argv.slice(2);

  if (args.includes('--dry-run')) {
    dryRun();
  } else {
    cleanupTags();
  }
}

export { cleanupTags, dryRun };