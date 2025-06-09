import type { PageLoad } from './$types';
import { type Project } from '$shared/types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch(
			'https://raw.githubusercontent.com/opensource-construction/osc-directory/main/backend/data/projects.json'
		);
		const projects: Project[] = await response.json();

		return {
			projects,
		};
	} catch (error) {
		console.error('Error loading projects:', error);
		return {
			projects: [],
		};
	}
};
