import type { Project } from "$shared/types";
import { PLATFORM_TAGS, FRAMEWORK_TAGS } from "./platform-tags.js";

export const fuseOptions = {
  keys: [
    {
      name: 'name',
      weight: 0.3 // Highest priority for project name
    },
    {
      name: 'description',
      weight: 0.25
    },

    {
      name: 'mainLanguage',
      weight: 0.15
    },
    {
      name: 'platforms',
      weight: 0.12 // Higher weight - platforms are important for compatibility
    },
    {
      name: 'frameworks',
      weight: 0.08 // Medium weight - frameworks help with technology matching
    },
    {
      name: 'metadata',
      weight: 0.1
    }
  ],
  threshold: 0.2, // 0.0 = perfect match, 1.0 = match anything
  distance: 100,
  minMatchCharLength: 2, // Don't match single characters
  includeScore: true,
  includeMatches: true, // For highlighting
  ignoreLocation: true // Search entire text, not just beginning
};

export const filterConfig = [
  {
    key: 'tags',
    label: 'Tags',
    icon: 'mdi:tag',
    getValue: (project: Project) =>
      project.tags && Array.isArray(project.tags) ? project.tags : null
  },
  {
    key: 'mainLanguage',
    label: 'Programming Language',
    icon: 'material-symbols-light:laptop-chromebook-rounded',
    getValue: (project: Project) => (project.mainLanguage ? [project.mainLanguage] : null)
  },
  {
    key: 'license',
    label: 'License',
    icon: 'material-symbols:license',
    getValue: (project: Project) => (project.license ? [project.license] : null)
  },
  {
    key: 'platforms',
    label: 'Platforms',
    icon: 'mdi:devices',
    getValue: (project: Project) => 
      project.platforms && Array.isArray(project.platforms) ? project.platforms : null
  },
  /*
  {
    key: 'frameworks',
    label: 'Frameworks',
    icon: 'mdi:code-braces',
    getValue: (project: Project) => 
      project.frameworks && Array.isArray(project.frameworks) ? project.frameworks : null
  }
  */
];

