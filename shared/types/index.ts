// Platform and Framework types
export const PLATFORM_TAGS = {
  WINDOWS: 'windows',
  MACOS: 'macos', 
  LINUX: 'linux',
  WEB: 'web',
  MOBILE: 'mobile',
  ANDROID: 'android',
  IOS: 'ios',
  DESKTOP: 'desktop',
  CLOUD: 'cloud',
  NODEJS: 'nodejs'
} as const;

export const FRAMEWORK_TAGS = {
  REACT: 'react',
  SVELTE: 'svelte',
  VUE: 'vue',
  ANGULAR: 'angular',
  ELECTRON: 'electron',
  TAURI: 'tauri',
  THREEJS: 'threejs',
  UNITY: 'unity',
  UNREAL: 'unreal',
  DJANGO: 'django',
  FLASK: 'flask',
  SPRING: 'spring',
  NODEJS: 'nodejs',
  DOTNET: 'dotnet',
  QT: 'qt'
} as const;

export type PlatformTag = typeof PLATFORM_TAGS[keyof typeof PLATFORM_TAGS];
export type FrameworkTag = typeof FRAMEWORK_TAGS[keyof typeof FRAMEWORK_TAGS];

export interface BaseProjectData {
  url: string;
  tags?: string[];
  submitterUsername?: string;
  platforms?: PlatformTag[];
  frameworks?: FrameworkTag[];
}

export interface Project extends BaseProjectData {
  name: string;
  description: string;
  repository?: string;
  stars?: number;
  forks?: number;
  mainLanguage?: string;
  license?: string;
  licenseManual?: boolean; // For manual license overrides
  lastUpdated?: string;
  openIssues?: number;
  submissionDate?: string;
  // New fields for platform compatibility
  platforms?: PlatformTag[];
  frameworks?: FrameworkTag[];
}