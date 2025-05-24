import { z } from 'zod';

// Predefined categories
export const predefinedCategories = [
	'BIM Tools',
	'Visualization',
	'Analysis',
	'Interoperability',
	'Parametric Design',
	'Data Management',
	'Infrastructure',
	'Sustainability',
	'Development Tools',
	'Other'
] as const;

// Mutable categories array for extension
export const categories: string[] = [...predefinedCategories];

// Project schema
export const ProjectSchema = z.object({
	repository: z.string().url(),
	name: z.string().optional(),
	description: z.string().optional(),
	url: z.string().url().optional(),
	license: z.string().optional(),
	stars: z.number().nonnegative().optional(),
	forks: z.number().nonnegative().optional(),
	lastUpdated: z.string().optional(),
	lastCommit: z.string().optional(),
	openIssues: z.number().nonnegative().optional(),
	mainLanguage: z.string().optional(),
	language: z.string().optional(),
	category: z.string().optional(),
	tags: z.array(z.string()).optional(),
	submittedBy: z.string().optional(),
	submissionDate: z.string().datetime().optional(),
});


export default {
	ProjectSchema,
	categories,
};