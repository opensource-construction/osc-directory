export interface Project {
  name: string;
  url: string;
  description: string;
  category: string[];
  lastUpdated?: string;
  stars?: number;
  forks?: number;
  mainLanguage?: string;
  license?: string;
  contributors?: number;
  submittedBy?: string;
  submissionDate?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'lca',
    name: 'Life Cycle Assessment',
    description: 'Tools and libraries for conducting life cycle assessments in the AEC industry'
  },
  {
    id: 'bim',
    name: 'Building Information Modeling',
    description: 'Tools for creating, managing, and analyzing building information models'
  },
  {
    id: 'visualization',
    name: 'Visualization',
    description: 'Tools and libraries for visualizing AEC data and models'
  },
  {
    id: 'analysis',
    name: 'Structural & Environmental Analysis',
    description: 'Tools for structural, environmental, and performance analysis'
  },
  {
    id: 'interoperability',
    name: 'Interoperability',
    description: 'Tools for converting between different AEC data formats and standards'
  },
  {
    id: 'generative',
    name: 'Generative Design',
    description: 'Tools for generative and parametric design in architecture and engineering'
  }
];
