import { db } from '$lib/server/db';
import { jwt } from '$lib/server/jwt';
import { redirect } from '@sveltejs/kit';

/**
 * @type {import("@sveltejs/kit").Handle}
 */
export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/gestion')) {
		const token = event.cookies.get('token');
		if (token) {
			const result = jwt.verify(token);

			if (result.success) {
				const user = await db.users.findById(result.payload._id);
				if (user && user.roles.includes('admin'))
					event.locals.user = {
						_id: user._id.toString(),
						roles: user.roles,
						username: user.username,
						password: user.password
					};
			}

			if (!event.locals.user) {
				event.cookies.delete('token', { path: '/' });
			}
		}

		if (event.url.pathname === '/gestion') {
			if (event.locals.user) throw redirect(302, '/gestion/messages');
		} else {
			if (!event.locals.user) throw redirect(302, '/gestion');
		}
	}

	return await resolve(event);
}
