import { access, unlink } from 'fs/promises';
import test from 'ava';
import Storage from '../controllers/storage.mjs';
import { faker } from '@faker-js/faker';
import Questions from '../controllers/questions.mjs';
import {writeFile} from 'node:fs/promises';

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

test.serial('Should throw an error when question is not typeof object or question with specified id does not exist', async t => {
	const questions = await Questions('test2.json');
	await t.throwsAsync(async () => {
		await questions.getAnswers(faker.datatype.uuid());
	}, {instanceOf: Error, message: `Question with specified id does not exist!`});

	let question = [];
	await writeFile('data/test2.json', JSON.stringify([question], undefined, '  '), {encoding: 'utf8'});
	await t.throwsAsync(async () => {
		await questions.getAnswers((await questions.getQuestions())[0].id);
	}, {instanceOf: Error, message: `Question with specified id does not exist!`});


	question = 123;
	await writeFile('data/test2.json', JSON.stringify([question], undefined, '  '), {encoding: 'utf8'});
	await t.throwsAsync(async () => {
		await questions.getAnswers((await questions.getQuestions())[0].id);
	}, {instanceOf: Error, message: `Question with specified id does not exist!`});


	question = 'string';
	await writeFile('data/test2.json', JSON.stringify([question], undefined, '  '), {encoding: 'utf8'});
	await t.throwsAsync(async () => {
		await questions.getAnswers((await questions.getQuestions())[0].id);
	}, {instanceOf: Error, message: `Question with specified id does not exist!`});

});