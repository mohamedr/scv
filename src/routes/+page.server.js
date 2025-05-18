import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';

/**
 * @type {import("./$types").Actions}
 */
export const actions = {
	async sendEmail({ request }) {
		const form = await request.formData();
		const payload = {
			firstname: /** @type {string} */ (form.get('firstname')),
			lastname: /** @type {string} */ (form.get('lastname')),
			email: /** @type {string} */ (form.get('email')),
			message: /** @type {string} */ (form.get('message'))
		};

		if (payload.message.length <= 2) {
			throw error(400, {
				message: 'Le sujet doit faire plus de 2 caractères.'
			});
		}

		await db.messages.insertOne({
			...payload,
			archived: false,
			date: new Date()
		});

		return {
			data: 'Some data'
		};
	}
};
