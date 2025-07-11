import type { PageLoad } from './$types';
import { type Project } from '$shared/types';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';

export const load: PageLoad = async ({ fetch }) => {
	try {
		let response;

		// Check if we should use local API (dev mode or explicitly enabled)
		const useLocalAPI = dev || env.PUBLIC_USE_LOCAL_API === 'true';

		if (useLocalAPI) {
			// Try local API first
			try {
				response = await fetch('/api/projects');
				console.log('Using local API');
			} catch (localError) {
				console.log('Local API not available, falling back to GitHub');
				response = await fetch(
					'https://raw.githubusercontent.com/opensource-construction/osc-directory/main/backend/data/projects.json'
				);
			}
		} else {
			// Use GitHub directly
			console.log('Using GitHub API');
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