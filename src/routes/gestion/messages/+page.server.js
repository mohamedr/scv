import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

/**
 * @type {import("./$types").PageServerLoad}
 */
export async function load() {
	return {
		messages: await db.messages.find()
	};
}

/**
 * @type {import("./$types").Actions}
 */
export const actions = {
	async archive({ request }) {
		const _id = new ObjectId((await request.formData()).get('_id')?.toString() ?? '');

		const message = await db.messages.findOne({ _id });

		if (!message) throw error(404, `Le message n'a pas été trouvé.`);

		await db.messages.updateOne(
			{ _id },
			{
				$set: { archived: true }
			}
		);
	}
};
