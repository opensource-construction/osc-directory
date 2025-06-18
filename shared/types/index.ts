export interface BaseProjectData {
  url: string;
  tags?: string[];
  submitterUsername?: string;
}

export interface Project extends BaseProjectData {
  name: string;
  description: string;
  repository?: string;
  stars?: number;
  forks?: number;
  mainLanguage?: string;
  license?: string;
  lastUpdated?: string;
  openIssues?: number;
  submissionDate?: string;
}