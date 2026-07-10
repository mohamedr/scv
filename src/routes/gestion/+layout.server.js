import { db } from '$lib/server/db';

/**
 * @type {import("./$types").LayoutServerLoad}
 */
export async function load({ locals }) {
	if (!locals.user) {
		return { user: null, counts: null };
	}

	const [messages, news] = await Promise.all([db.messages.find(), db.news.find()]);

	return {
		user: { username: locals.user.username },
		counts: {
			messagesUnread: messages.filter((m) => !m.archived).length,
			messagesTotal: messages.length,
			articles: news.length,
			articlesVisible: news.filter((n) => n.visible).length
		}
	};
}
