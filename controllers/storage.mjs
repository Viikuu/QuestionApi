import {readFile, writeFile, access, mkdir} from 'node:fs/promises';
import ApiError from '../utils/custom-error.mjs';
const {MongoClient} = require('mongodb');

async function Storage(fileName) {
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
