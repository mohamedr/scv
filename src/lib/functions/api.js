import { deserialize } from '$app/forms';

export const api = {
	/**
	 * @param {string} endpoint
	 * @param {Record<string, string | Blob>} [payload={}]
	 */
	async action(endpoint, payload = {}) {
		const body = new FormData();

		for (const key in payload) {
			const value = payload[key];
			body.set(key, value);
		}

		const response = await fetch(endpoint, {
			method: 'POST',
			body
		});

		const result = deserialize(await response.text());

		switch (result.type) {
			case 'success':
				return result.data;

			case 'error':
				throw result.error;

			default:
				throw new Error(`Unknown ${result.status} error of type: ${result.type}`);
		}
	}
};
