import type { PageLoad } from './$types';
import { type Project } from '$shared/types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/TheVessen/osc-directory/main/src/lib/data/projects.json'); // Or whatever your API endpoint is
    const projects: Project[] = await response.json();

    // Extract unique categories
    const categories = ['all', ...new Set(projects.map(project => project.category))];

    return {
      projects,
      categories
    };
  } catch (error) {
    console.error('Error loading projects:', error);
    return {
      projects: [],
      categories: ['all']
    };
  }
};