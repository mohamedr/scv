import { redirect } from '@sveltejs/kit';

/**
 * @type {import("./$types").RequestHandler}
 */
export function POST({ cookies }) {
	cookies.delete('token', { path: '/' });
	throw redirect(303, '/gestion');
}
