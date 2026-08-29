import { deserialize } from '$app/forms';

const DEFAULT_ERROR = 'Une erreur inattendue est survenue. Merci de réessayer.';

/**
 * Extrait un message lisible des différents formats renvoyés par les actions SvelteKit.
 * @param {unknown} value
 * @returns {string | undefined}
 */
function errorMessage(value) {
	if (typeof value === 'string' && value.trim()) return value;
	if (!value || typeof value !== 'object') return undefined;

	if ('message' in value && typeof value.message === 'string' && value.message.trim()) {
		return value.message;
	}

	if ('error' in value) return errorMessage(value.error);
	if ('data' in value) return errorMessage(value.data);

	return undefined;
}

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

		/** @type {Response} */
		let response;
		try {
			response = await fetch(endpoint, {
				method: 'POST',
				body
			});
		} catch {
			throw new Error(
				'Impossible de contacter le serveur. Vérifiez votre connexion puis réessayez.'
			);
		}

		if (response.redirected && new URL(response.url).pathname === '/gestion') {
			throw new Error('Votre session a expiré. Reconnectez-vous puis réessayez.');
		}

		const text = await response.text();
		if (!text.trim()) {
			throw new Error(
				response.ok
					? DEFAULT_ERROR
					: `Le serveur n’a pas pu traiter la demande (erreur ${response.status}).`
			);
		}

		let result;
		try {
			result = deserialize(text);
		} catch {
			throw new Error(
				response.ok
					? DEFAULT_ERROR
					: `Le serveur a renvoyé une réponse invalide (erreur ${response.status}).`
			);
		}

		switch (result.type) {
			case 'success':
				return result.data;

			case 'error':
				throw new Error(errorMessage(result.error) ?? DEFAULT_ERROR);

			case 'failure':
				throw new Error(
					errorMessage(result.data) ??
						`Les informations envoyées ne sont pas valides (erreur ${result.status}).`
				);

			case 'redirect':
				throw new Error('Votre session a expiré. Reconnectez-vous puis réessayez.');

			default:
				throw new Error(DEFAULT_ERROR);
		}
	}
};
