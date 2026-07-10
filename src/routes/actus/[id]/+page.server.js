import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';

/**
 * @type {import("./$types").PageServerLoad}
 */
export async function load({ params }) {
	const article = await db.news.getVisibleById(params.id);

	if (!article) {
		throw error(404, "Cet article n'existe pas ou n'est plus disponible.");
	}

	return { article };
}
