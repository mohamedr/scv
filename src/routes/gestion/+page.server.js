import { db } from '$lib/server/db';
import { jwt } from '$lib/server/jwt';

/**
 * @type {import("./$types").PageServerLoad}
 */
export async function load({ locals }) {
	if (!locals.user) {
		const admin = await db.users.findOneAdmin();
		return { first: !admin };
	}

	const [messages, news] = await Promise.all([db.messages.find(), db.news.find()]);

	return {
		recentMessages: messages.filter((m) => !m.archived).slice(0, 4),
		recentArticles: news.slice(0, 4)
	};
}

/**
 * @type {import("./$types").Actions}
 */
export const actions = {
	async login({ request, cookies }) {
		const form = await request.formData();
		const user = await db.users.findAndVerify(
			form.get('username')?.toString() ?? '',
			form.get('password')?.toString() ?? ''
		);

		const token = jwt.sign({ _id: user._id.toString() });
		cookies.set('token', token, { path: '/' });
	},

	async create({ request }) {
		const form = await request.formData();

		await db.users.create(
			form.get('username')?.toString() ?? '',
			form.get('password')?.toString() ?? ''
		);
	}
};
