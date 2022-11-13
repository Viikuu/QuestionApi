import test from 'ava';
import Storage from '../controllers/storage.mjs';
import { access, unlink } from 'fs/promises';
import { faker } from '@faker-js/faker';

test('Should throw error if fileName is not a json file name', async t => {
	await t.throwsAsync(async () => {
		await Storage('123');
	}, {instanceOf:Error, message: 'Specified file should be a JSON file'});
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


