import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto';

/**
 * @param {import("crypto").BinaryLike} password
 * @param {import("crypto").BinaryLike} salt
 * @param {number} keylen
 *
 * @returns {Promise<Buffer<ArrayBufferLike>>}
 */
function scrypt(password, salt, keylen) {
	return new Promise((resolve, reject) =>
		_scrypt(password, salt, keylen, (err, key) => {
			if (err) reject(err);
			else resolve(key);
		})
	);
}

const KEYLEN = 64;

export const password = {
	/**
	 * @param {string} password
	 */
	async hash(password) {
		const salt = randomBytes(16).toString('hex');
		const buff = await scrypt(password, salt, KEYLEN);

		return buff.toString('hex') + '.' + salt;
	},

	/**
	 * @param {string} hashed
	 * @param {string} password
	 */
	async verify(hashed, password) {
		const [hashedPassword, salt] = hashed.split('.');
		const hashedPasswordBuffer = Buffer.from(hashedPassword, 'hex');
		const passwordBuffer = await scrypt(password, salt, KEYLEN);

		return timingSafeEqual(hashedPasswordBuffer, passwordBuffer);
	}
};
