// Schema for project data

export const projectSchema = {
	required: ['repository'],
	properties: {
		name: { type: 'string' },
		description: { type: 'string' },
		url: { type: 'string', format: 'uri' },
		repository: { type: 'string', format: 'uri' },
		license: { type: 'string' },
		stars: { type: 'number' },
		forks: { type: 'number' },
		lastUpdated: { type: 'string' },
		lastCommit: { type: 'string' },
		openIssues: { type: 'number' },
		mainLanguage: { type: 'string' },
		language: { type: 'string' },
		category: { type: 'string' },
		tags: {
			type: 'array',
			items: { type: 'string' }
		},
		metadata: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					key: { type: 'string' },
					value: { type: 'string' },
					url: { type: 'string', format: 'uri' }
				},
				required: ['key', 'value']
			}
		},
		submittedBy: { type: 'string' },
		submissionDate: { type: 'string', format: 'date' }
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

// Add information about automatically fetched fields
export const autoFetchedFields = [
	'name',
	'url',
	'stars',
	'forks',
	'license',
	'lastUpdated',
	'mainLanguage'
];

export default { projectSchema, categories, autoFetchedFields };
