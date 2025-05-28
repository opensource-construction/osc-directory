import type { PageLoad } from './$types';
import { type Project } from '$shared/types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/opensource-construction/osc-directory/main/backend/data/projects.json');
    const projects: Project[] = await response.json();

    // Not needed anymore, since are not filtering by category on the frontend
    // TODO: Remove this when categories are no longer used
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


