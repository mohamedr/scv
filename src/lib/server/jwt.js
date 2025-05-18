import { JWT_SECRET } from '$env/static/private';
import { default as _jwt } from 'jsonwebtoken';

/**
 * @typedef {{
 *  _id: string;
 * }} Payload
 */
export const jwt = {
	/**
	 * @param {any} token
	 *
	 * @returns {{ success: false } | { success: true; payload: Payload }}
	 */
	verify(token) {
		if (typeof token !== 'string')
			return {
				success: false
			};

		try {
			return {
				success: true,
				payload: /** @type {Payload} */ (_jwt.verify(token, JWT_SECRET))
			};
		} catch (error) {
			return {
				success: false
			};
		}
	},

	/**
	 * @param {Payload} payload
	 */
	sign(payload) {
		return _jwt.sign(payload, JWT_SECRET, {
			expiresIn: '7d'
		});
	}
};
