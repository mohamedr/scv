import { db } from '$lib/server/db';

/**
 * @type {import("./$types").PageServerLoad}
 */
export async function load({ url }) {
	const id = url.searchParams.get('id');
	const article = id ? await db.news.getById(id) : null;

	return { article };
}

/**
 * @type {import("./$types").Actions}
 */
export const actions = {
	async save({ request }) {
		const form = await request.formData();

		const id = form.get('id')?.toString() ?? '';
		const title = form.get('title')?.toString() ?? '';
		const content = form.get('content')?.toString() ?? '';
		const visible = form.get('visible')?.toString() === 'true';

		if (id) {
			await db.news.update(id, title, content);
			await db.news.setVisible(id, visible);
		} else {
			const newId = await db.news.create(title, content);
			await db.news.setVisible(newId, visible);
		}

		return { ok: true };
	}
};
