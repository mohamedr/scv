import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request }) {
	const authorization = request.headers.get('authorization');

	// Vercel ajoute automatiquement ce Bearer token aux appels Cron lorsque
	// CRON_SECRET est défini dans les variables d'environnement du projet.
	if (!env.CRON_SECRET || authorization !== `Bearer ${env.CRON_SECRET}`) {
		throw error(401, 'Non autorisé');
	}

	await db.ping();

	return json(
		{ ok: true },
		{
			headers: {
				'cache-control': 'no-store'
			}
		}
	);
}
