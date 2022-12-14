import {access, unlink} from 'node:fs/promises';
import test from 'ava';
import {faker} from '@faker-js/faker';
import Storage from '../controllers/storage.mjs';

test('Should throw error if fileName is not a json file name', async t => {
	await t.throwsAsync(async () => {
		await Storage('123');
	}, {
		instanceOf: Error,
		message: 'Specified file should be a JSON file',
	});
});

test('Should create data/filename if data/filename does not exist', async t => {
	const filename = `${faker.word.interjection()}.json`;
	await Storage(filename);
	await t.notThrowsAsync(async () => {
		await access(`data/${filename}`).then(async () => {
			await unlink(`data/${filename}`);
		});
	});
});

test('Should return empty array when data/filename did not exist before Storage initialization', async t => {
	const filename = `${faker.word.interjection()}.json`;
	t.deepEqual(await (await Storage(filename)).getData(), []);
	await unlink(`data/${filename}`);
});

test('Should save object in data/filename and return exact same object', async t => {
	const filename = `${faker.word.interjection()}.json`;
	const object = {foo: 'bar'};
	const storage = await Storage(filename);
	await storage.saveData(object);
	t.deepEqual(await storage.getData(), object);
	await unlink(`data/${filename}`);
});
