import type { PageLoad } from './$types';
import { type Project } from '$shared/types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Try local API first, fall back to GitHub if not available
		let response;
		try {
			response = await fetch('/api/projects');
		} catch (localError) {
			console.log('Local API not available, falling back to GitHub');
			response = await fetch(
				'https://raw.githubusercontent.com/opensource-construction/osc-directory/main/backend/data/projects.json'
			);
		}
		
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
