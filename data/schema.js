// Schema for project data

export const projectSchema = {
	required: ['name', 'description', 'url', 'repository'],
	properties: {
		name: { type: 'string' },
		description: { type: 'string' },
		url: { type: 'string', format: 'uri' },
		repository: { type: 'string', format: 'uri' },
		license: { type: 'string' },
		stars: { type: 'number' },
		lastCommit: { type: 'string' },
		openIssues: { type: 'number' },
		category: { type: 'string' },
		tags: {
			type: 'array',
			items: { type: 'string' }
		}
	}
};

export const categories = [
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
];

export default { projectSchema, categories };
