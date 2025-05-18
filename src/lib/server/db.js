import { MONGO_URI } from '$env/static/private';
import { MongoClient, ObjectId } from 'mongodb';
import { password } from './password';
import { error } from '@sveltejs/kit';

const mongodb = new MongoClient(MONGO_URI);
const scv = mongodb.db('scv');

const messages = scv.collection('messages');
const users = scv.collection('users');

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
	}
};
