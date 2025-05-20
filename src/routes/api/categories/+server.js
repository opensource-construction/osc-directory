import { json } from '@sveltejs/kit';
import { categories } from '../../../../data/schema.js';

export async function GET() {
	try {
		return json(categories);
	} catch (error) {
		console.error('Error loading categories:', error);
		return json({ error: 'Failed to load categories data' }, { status: 500 });
	}
}
