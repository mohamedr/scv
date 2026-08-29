import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { JWT_SECRET } from '$env/static/private';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

/** @param {FormData} form @param {string} name */
function field(form, name) {
	const value = form.get(name);
	return typeof value === 'string' ? value.trim() : '';
}

/** @param {string} address */
async function hashSender(address) {
	const bytes = new TextEncoder().encode(`${JWT_SECRET}\0${address}`);
	const digest = await crypto.subtle.digest('SHA-256', bytes);
	return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * @type {import("./$types").PageServerLoad}
 */
export async function load() {
	// Le site public ne doit pas tomber si la base est injoignable :
	// en cas d'erreur, on affiche simplement la page sans les actualités.
	try {
		return {
			news: await db.news.findVisible()
		};
	} catch (err) {
		console.error('[home] chargement des actualités impossible :', err);
		return { news: [] };
	}
}

/**
 * @type {import("./$types").Actions}
 */
export const actions = {
	async sendEmail({ request, getClientAddress }) {
		const form = await request.formData();

		// Champ invisible pour les robots. On leur répond normalement sans enregistrer le message.
		if (field(form, 'website')) return { ok: true };

		const payload = {
			firstname: field(form, 'firstname'),
			lastname: field(form, 'lastname'),
			email: field(form, 'email').toLowerCase(),
			message: field(form, 'message')
		};

		if (payload.firstname.length < 2 || payload.firstname.length > 80)
			throw error(400, { message: 'Le prénom doit contenir entre 2 et 80 caractères.' });
		if (payload.lastname.length < 2 || payload.lastname.length > 80)
			throw error(400, { message: 'Le nom doit contenir entre 2 et 80 caractères.' });
		if (payload.email.length > 254 || !EMAIL_PATTERN.test(payload.email))
			throw error(400, { message: "L'adresse e-mail n'est pas valide." });
		if (payload.message.length < 10 || payload.message.length > 5000)
			throw error(400, { message: 'Le message doit contenir entre 10 et 5 000 caractères.' });

		const senderHash = await hashSender(getClientAddress());
		await db.messages.assertCanSend(senderHash);

		await db.messages.insertOne({
			...payload,
			senderHash,
			archived: false,
			date: new Date()
		});
	}
};
