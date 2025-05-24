import type { JSONSchema7 } from 'json-schema';

// Schema for project data
export const projectSchema: JSONSchema7 = {
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

export type ProjectCategory =
	| 'BIM Tools'
	| 'Visualization'
	| 'Analysis'
	| 'Interoperability'
	| 'Parametric Design'
	| 'Data Management'
	| 'Infrastructure'
	| 'Sustainability'
	| 'Development Tools'
	| 'Other';

export const categories: readonly string[] = [
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

export type AutoFetchedField =
	| 'name'
	| 'url'
	| 'stars'
	| 'forks'
	| 'license'
	| 'lastUpdated'
	| 'mainLanguage';

export const autoFetchedFields: readonly AutoFetchedField[] = [
	'name',
	'url',
	'stars',
	'forks',
	'license',
	'lastUpdated',
	'mainLanguage'
];

export default { projectSchema, categories, autoFetchedFields };