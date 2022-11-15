import {unlink, writeFile} from 'node:fs/promises';
import test from 'ava';
import {faker} from '@faker-js/faker';
import Questions from '../controllers/questions.mjs';

test.after(async () => {
	await unlink('data/test2.json');
});

test.beforeEach(async () => {
	await writeFile('data/test2.json', JSON.stringify([], undefined, '  '), {encoding: 'utf8'});
});

test.serial('Should return empty array when no answers are added', async t => {
	const questions = await Questions('test2.json');
	let question = {
		summary: 'What is moon?',
		author: 'Jack London Third',
	};
	await questions.addQuestion(question);

	t.deepEqual(await questions.getAnswers((await questions.getQuestions())[0].id), []);

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

test.serial('Should throw an error when question object is damaged', async t => {
	const questions = await Questions('test2.json');
	const id = 'e6455abf-22f9-4a9a-a942-b0fe9d848116';
	let question = {
		id,
	};
	await writeFile('data/test2.json', JSON.stringify([question], undefined, '  '), {encoding: 'utf8'});

	await t.throwsAsync(async () => {
		await questions.getAnswers(id);
	}, {instanceOf: Error, message: `Question object damaged!`});

	question = {
		id,
		author: "123",
		summary: 'What is',
		answers: 123,
	};
	await writeFile('data/test2.json', JSON.stringify([question], undefined, '  '), {encoding: 'utf8'});
	await t.throwsAsync(async () => {
		await questions.getAnswers(id);
	}, {instanceOf: Error, message: `Question object damaged!`});

	question = {
		id,
		author: [],
		summary: [],
		answers: [],
	};
	await writeFile('data/test2.json', JSON.stringify([question], undefined, '  '), {encoding: 'utf8'});
	await t.throwsAsync(async () => {
		await questions.getAnswers(id);
	}, {instanceOf: Error, message: `Question object damaged!`});

	question = {
		id,
		author: 123,
		summary: 'What is',
		answers: [],
	};
	await writeFile('data/test2.json', JSON.stringify([question], undefined, '  '), {encoding: 'utf8'});
	await t.throwsAsync(async () => {
		await questions.getAnswers(id);
	}, {instanceOf: Error, message: `Question object damaged!`});

	question = {
		id,
		author: "123",
		summary: 421,
		answers: [123],
	};
	await writeFile('data/test2.json', JSON.stringify([question], undefined, '  '), {encoding: 'utf8'});
	await t.throwsAsync(async () => {
		await questions.getAnswers(id);
	}, {instanceOf: Error, message: `Question object damaged!`});

});

test.serial('Should return array of answers', async t => {
	const questions = await Questions('test2.json');
	const id = 'e6455abf-22f9-4a9a-a942-b0fe9d848116';
	let question = {
		id,
		author: "123",
		summary: 'What is',
		answers: [
			{
				'id': '54362748-22f9-4a9a-a942-b0fe9d848116',
				'author': 'Brian McKenzie',
				'summary': 'The Earth is flat.',
			},
			{
				'id': '74927535-22f9-4a9a-a942-b0fe9d848116',
				'author': 'Dr Strange',
				'summary': 'It is egg-shaped.',
			},
		],
	};

	await writeFile('data/test2.json', JSON.stringify([question], undefined, '  '), {encoding: 'utf8'});

	t.deepEqual(await questions.getAnswers(id), question.answers);

});

test.serial('Should return single answer with specified id', async t => {
	const questions = await Questions('test2.json');
	const id = 'e6455abf-22f9-4a9a-a942-b0fe9d848116';
	const id2 = '54362748-22f9-4a9a-a942-b0fe9d848116';
	let question = {
		id,
		author: "123",
		summary: 'What is',
		answers: [
			{
				'id': id2,
				'author': 'Brian McKenzie',
				'summary': 'The Earth is flat.',
			},
			{
				'id': '74927535-22f9-4a9a-a942-b0fe9d848116',
				'author': 'Dr Strange',
				'summary': 'It is egg-shaped.',
			},
		],
	};

	await writeFile('data/test2.json', JSON.stringify([question], undefined, '  '), {encoding: 'utf8'});

	t.deepEqual(await questions.getAnswer(id, id2),
		{
			'id': id2,
			'author': 'Brian McKenzie',
			'summary': 'The Earth is flat.',
		});
});


test.serial('Should return undefined when answer with specified id does not exist', async t => {
	const questions = await Questions('test2.json');
	const id = 'e6455abf-22f9-4a9a-a942-b0fe9d848116';
	let question = {
		id,
		author: "123",
		summary: 'What is',
		answers: [
			{
				'id': faker.datatype.uuid(),
				'author': 'Brian McKenzie',
				'summary': 'The Earth is flat.',
			},
			{
				'id': faker.datatype.uuid(),
				'author': 'Dr Strange',
				'summary': 'It is egg-shaped.',
			},
		],
	};

	await writeFile('data/test2.json', JSON.stringify([question], undefined, '  '), {encoding: 'utf8'});

	t.is(await questions.getAnswer(id, faker.datatype.uuid()), undefined);
});
