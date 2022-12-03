const {MongoClient} = require('mongodb');
import ApiError from '../utils/custom-error.mjs';

async function Storage() {
	const url = process.env.DB_URL;

	const client = new MongoClient(url);
	try {
		await client.connect();
	} catch (error) {
		throw new ApiError("DataBase problem ...");
	}

	async function saveData(data) {

	}

	async function getData() {

	}

	return {
		saveData,
		getData,
	};
}

export default Storage;
