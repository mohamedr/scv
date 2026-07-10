import { db } from '$lib/server/db';

/**
 * @type {import("./$types").PageServerLoad}
 */
export async function load() {
	return {
		news: await db.news.find()
	};
}

/**
 * @type {import("./$types").Actions}
 */
export const actions = {
	async toggleVisible({ request }) {
		const form = await request.formData();

		await db.news.setVisible(
			form.get('_id')?.toString() ?? '',
			form.get('visible')?.toString() === 'true'
		);
	},

	async delete({ request }) {
		const form = await request.formData();

		await db.news.delete(form.get('_id')?.toString() ?? '');
	}
};
