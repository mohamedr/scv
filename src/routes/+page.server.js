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
			subject: /** @type {string} */ (form.get('subject')),
			message: /** @type {string} */ (form.get('message'))
		};

		console.log(payload);

		await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2s

		if (payload.subject.length <= 2) {
			throw error(400, {
				message: 'Le sujet doit faire plus de 2 caractères.'
			});
		}

		return {
			data: 'Some data'
		};
	}
};
