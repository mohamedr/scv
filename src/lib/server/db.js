import { MONGO_URI } from '$env/static/private';
import { MongoClient, ObjectId } from 'mongodb';
import { password } from './password';
import { error } from '@sveltejs/kit';

// fail-fast : bascule en mode dégradé en ~5s si la base est injoignable
// (au lieu du timeout de sélection de serveur par défaut, ~30s).
const uri = MONGO_URI.includes('?')
	? `${MONGO_URI}&serverSelectionTimeoutMS=5000`
	: `${MONGO_URI}?serverSelectionTimeoutMS=5000`;
const mongodb = new MongoClient(uri);
const scv = mongodb.db('scv');

const messages = scv.collection('messages');
const users = scv.collection('users');
const news = scv.collection('news');

/**
 * @param {import('mongodb').WithId<import('mongodb').Document>} doc
 */
function contentOf(doc) {
	// compat : anciens articles stockés en texte brut (`body`)
	return doc.content ?? (doc.body ? `<p>${doc.body}</p>` : '');
}

/**
 * @param {string} html
 */
function stripHtml(html) {
	return html
		.replace(/<[^>]*>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * @param {string} html
 */
function excerptOf(html, max = 180) {
	const text = stripHtml(html);
	return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
}

/**
 * Première image du contenu (data-URI base64 ou url) — sert de couverture.
 * @param {string} html
 */
function coverOf(html) {
	const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
	return match ? match[1] : null;
}

/**
 * Aperçu léger pour les listes (pas le contenu complet).
 * @param {import('mongodb').WithId<import('mongodb').Document>} doc
 */
function mapTeaser(doc) {
	const content = contentOf(doc);
	return {
		_id: doc._id.toString(),
		title: doc.title,
		date: doc.date,
		visible: doc.visible,
		featured: doc.featured ?? false,
		excerpt: excerptOf(content),
		cover: coverOf(content)
	};
}

/**
 * Article complet (contenu HTML inclus).
 * @param {import('mongodb').WithId<import('mongodb').Document>} doc
 */
function mapFull(doc) {
	return {
		_id: doc._id.toString(),
		title: doc.title,
		content: contentOf(doc),
		date: doc.date,
		visible: doc.visible,
		featured: doc.featured ?? false
	};
}

/**
 * Nettoyage minimal du HTML admin (retire scripts et handlers inline).
 * @param {string} html
 */
function sanitize(html) {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, '')
		.replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
		.replace(/\son\w+\s*=\s*'[^']*'/gi, '');
}

/**
 * @param {string} title
 * @param {string} content
 */
function validateNews(title, content) {
	title = title.trim();
	content = sanitize(content.trim());

	if (title.length < 3) throw error(400, 'Le titre doit faire au moins 3 caractères.');
	if (stripHtml(content).length < 3 && !coverOf(content))
		throw error(400, `L'article ne peut pas être vide.`);

	return { title, content };
}

export const db = {
	messages: {
		async find() {
			const out = await messages.find().toArray();
			return out.map((doc) => ({
				_id: doc._id.toString(),
				email: doc.email,
				firstname: doc.firstname,
				lastname: doc.lastname,
				message: doc.message,
				archived: doc.archived
			}));
		},

		/**
		 * @param {import('mongodb').Filter<import('mongodb').Document>} filters
		 */
		findOne: (filters) => messages.findOne(filters),

		/** @type {typeof messages.updateOne} */
		updateOne: (...args) => messages.updateOne(...args),

		/**
		 * @param {*} doc
		 */
		insertOne(doc) {
			return messages.insertOne(doc);
		}
	},
	users: {
		/**
		 * @param {string} username
		 * @param {string} pass
		 */
		async findAndVerify(username, pass) {
			const user = await users.findOne({ username, roles: 'admin' });
			if (!user) throw error(404, 'Utilisateur non trouvé');

			const correct = await password.verify(user.password, pass);
			if (!correct) throw error(404, 'Utilisateur non trouvé');

			return user;
		},

		async findOneAdmin() {
			const admin = await users.findOne({
				roles: 'admin'
			});

			return admin;
		},

		/**
		 * @param {string} username
		 * @param {string} pass
		 */
		async create(username, pass) {
			username = username.trim();

			if (username.length < 4)
				throw error(400, `Le nom d'utilisateur doit faire au moins 4 caractères.`);
			if (pass.length < 4) throw error(400, 'Le mot de passe doit faire au moins 4 caractères.');

			const user = await users.findOne({ username });

			if (user) throw error(400, `Ce nom d'utilisateur est déjà pris.`);

			await users.insertOne({
				roles: ['admin'],
				username,
				password: await password.hash(pass)
			});
		},

		/**
		 * @param {string} _id
		 */
		findById(_id) {
			return users.findOne({ _id: new ObjectId(_id) });
		}
	},
	news: {
		/**
		 * Aperçus de toutes les actualités, plus récentes en premier (back-office).
		 */
		async find() {
			const out = await news.find().sort({ date: -1 }).toArray();
			return out.map(mapTeaser);
		},

		/**
		 * Aperçus des actualités visibles (public).
		 * Tri : l'article "à la une" d'abord, sinon les plus récentes.
		 */
		async findVisible() {
			const out = await news.find({ visible: true }).sort({ featured: -1, date: -1 }).toArray();
			return out.map(mapTeaser);
		},

		/**
		 * Article complet par id (back-office).
		 * @param {string} _id
		 */
		async getById(_id) {
			if (!ObjectId.isValid(_id)) return null;
			const doc = await news.findOne({ _id: new ObjectId(_id) });
			return doc ? mapFull(doc) : null;
		},

		/**
		 * Article complet par id, seulement s'il est visible (public).
		 * @param {string} _id
		 */
		async getVisibleById(_id) {
			if (!ObjectId.isValid(_id)) return null;
			const doc = await news.findOne({ _id: new ObjectId(_id), visible: true });
			return doc ? mapFull(doc) : null;
		},

		/**
		 * @param {string} title
		 * @param {string} content
		 * @returns {Promise<string>} l'id du nouvel article
		 */
		async create(title, content) {
			const clean = validateNews(title, content);

			const result = await news.insertOne({
				...clean,
				visible: true,
				featured: false,
				date: new Date()
			});

			return result.insertedId.toString();
		},

		/**
		 * @param {string} _id
		 * @param {string} title
		 * @param {string} content
		 */
		async update(_id, title, content) {
			const clean = validateNews(title, content);

			const result = await news.updateOne({ _id: new ObjectId(_id) }, { $set: clean });

			if (!result.matchedCount) throw error(404, `L'article n'a pas été trouvé.`);
		},

		/**
		 * @param {string} _id
		 * @param {boolean} visible
		 */
		async setVisible(_id, visible) {
			const result = await news.updateOne({ _id: new ObjectId(_id) }, { $set: { visible } });

			if (!result.matchedCount) throw error(404, `L'actualité n'a pas été trouvée.`);
		},

		/**
		 * Met (ou retire) un article "à la une". Une seule à la une à la fois :
		 * activer un article désactive automatiquement tous les autres.
		 * @param {string} _id
		 * @param {boolean} featured
		 */
		async setFeatured(_id, featured) {
			if (!ObjectId.isValid(_id)) throw error(404, `L'article n'a pas été trouvé.`);
			const id = new ObjectId(_id);

			if (featured) {
				// on retire la une de tous les autres, puis on l'attribue à celui-ci
				await news.updateMany({ _id: { $ne: id } }, { $set: { featured: false } });
				const result = await news.updateOne({ _id: id }, { $set: { featured: true } });
				if (!result.matchedCount) throw error(404, `L'article n'a pas été trouvé.`);
			} else {
				const result = await news.updateOne({ _id: id }, { $set: { featured: false } });
				if (!result.matchedCount) throw error(404, `L'article n'a pas été trouvé.`);
			}
		},

		/**
		 * @param {string} _id
		 */
		async delete(_id) {
			const result = await news.deleteOne({ _id: new ObjectId(_id) });

			if (!result.deletedCount) throw error(404, `L'actualité n'a pas été trouvée.`);
		}
	}
};
