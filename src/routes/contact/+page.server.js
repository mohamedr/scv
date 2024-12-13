/**
 * @type {import("./$types").Actions}
 */
export const actions = {
	async sendEmail({ request }) {
		const form = await request.formData();
		const payload = {
			firstname: form.get('firstname'),
			lastname: form.get('lastname'),
			subject: form.get('subject'),
			message: form.get('message')
		};

		console.log(payload);

		return {
			success: true
		};
	}
};
