import {unlink, writeFile} from 'node:fs/promises';
import test from 'ava';
import {faker} from '@faker-js/faker';
import Questions from '../controllers/questions.mjs';

test.after(async () => {
	await unlink('data/test.json');
});

test.beforeEach(async () => {
	await writeFile('data/test.json',
		JSON.stringify([], undefined, '  '),
		{
			encoding: 'utf8',
		});
});

test.serial('Should return empty list when no questions were created', async t => {
	t.deepEqual(await (await Questions('test.json')).getQuestions(), []);
});

test.serial('Should return list of questions which are in a test.json file', async t => {
	const testQuestions = [
		{
			id: 'e6455abf-22f9-4a9a-a942-b0fe9d848116',
			summary: 'What is my name?',
			author: 'Jack London',
			answers: [],
		},
		{
			id: '35c05570-622e-4008-a389-3694873e667a',
			summary: 'Who are you?',
			author: 'Tim Doods',
			answers: [],
		},
	];
	await writeFile('data/test.json',
		JSON.stringify(testQuestions, undefined, '  '),
		{
			encoding: 'utf8',
		});

	t.deepEqual(await (await Questions('test.json')).getQuestions(), testQuestions);
});

test.serial('Should throw error when question with specified id does not exist', async t => {
	const testQuestions = [
		{
			id: faker.datatype.uuid(),
			summary: 'What is my name?',
			author: 'Jack London',
			answers: [],
		},
		{
			id: faker.datatype.uuid(),
			summary: 'Who are you?',
			author: 'Tim Doods',
			answers: [],
		},
	];

	await t.throwsAsync(async () => {
		await (await Questions('test.json')).getQuestionById(faker.datatype.uuid());
	}, {
		instanceOf: Error,
		message: 'Question with specified id does not exist',
	});

	await writeFile('data/test.json',
		JSON.stringify(testQuestions, undefined, '  '),
		{
			encoding: 'utf8',
		});

	await t.throwsAsync(async () => {
		await (await Questions('test.json')).getQuestionById(faker.datatype.uuid());
	}, {
		instanceOf: Error,
		message: 'Question with specified id does not exist',
	});
});

test.serial('Should return question with specified id ', async t => {
	const testQuestions = [
		{
			id: 'e6455abf-22f9-4a9a-a942-b0fe9d848116',
			summary: 'What is my name?',
			author: 'Jack London',
			answers: [],
		},
		{
			id: '35c05570-622e-4008-a389-3694873e667a',
			summary: 'Who are you?',
			author: 'Tim Doods',
			answers: [],
		},
	];
	await writeFile('data/test.json',
		JSON.stringify(testQuestions, undefined, '  '),
		{
			encoding: 'utf8',
		});

	t.deepEqual(await (await Questions('test.json')).getQuestionById('e6455abf-22f9-4a9a-a942-b0fe9d848116'), testQuestions[0]);
	t.deepEqual(await (await Questions('test.json')).getQuestionById('35c05570-622e-4008-a389-3694873e667a'), testQuestions[1]);
});

test.serial('Should throw error if added question is not typeof object ', async t => {
	let question = '123';
	await t.throwsAsync(async () => {
		await (await Questions('test.json')).addQuestion(question);
	}, {
		instanceOf: Error,
		message: `Expected question to be an object, got ${typeof question}`,
	});

	question = 123;
	await t.throwsAsync(async () => {
		await (await Questions('test.json')).addQuestion(question);
	}, {
		instanceOf: Error,
		message: `Expected question to be an object, got ${typeof question}`,
	});

	question = [];
	await t.throwsAsync(async () => {
		await (await Questions('test.json')).addQuestion(question);
	}, {
		instanceOf: Error,
		message: `Expected question to be an object, got ${typeof question}`,
	});
});

test.serial('Should throw error if added question.author is not typeof string ', async t => {
	let question = {
		id: 'e6455abf-22f9-4a9a-a942-b0fe9d848116',
		summary: 'What is my name?',
		author: {name: 'Jack London'},
		answers: [],
	};
	await t.throwsAsync(async () => {
		await (await Questions('test.json')).addQuestion(question);
	}, {
		instanceOf: Error,
		message: `Expected question.author to be a string, got ${typeof question.author}`,
	});

	question = {
		id: 'e6455abf-22f9-4a9a-a942-b0fe9d848116',
		summary: 'What is my name?',
		author: 123,
		answers: [],
	};
	await t.throwsAsync(async () => {
		await (await Questions('test.json')).addQuestion(question);
	}, {
		instanceOf: Error,
		message: `Expected question.author to be a string, got ${typeof question.author}`,
	});

	question = {
		id: 'e6455abf-22f9-4a9a-a942-b0fe9d848116',
		summary: 'What is my name?',
		answers: [],
	};
	await t.throwsAsync(async () => {
		await (await Questions('test.json')).addQuestion(question);
	}, {
		instanceOf: Error,
		message: `Expected question.author to be a string, got ${typeof question.author}`,
	});

	question = {
		id: 'e6455abf-22f9-4a9a-a942-b0fe9d848116',
		summary: 'What is my name?',
		author: [],
		answers: [],
	};
	await t.throwsAsync(async () => {
		await (await Questions('test.json')).addQuestion(question);
	}, {
		instanceOf: Error,
		message: `Expected question.author to be a string, got ${typeof question.author}`,
	});
});

test.serial('Should throw error if added question.summary is not typeof string ', async t => {
	let question = {
		id: 'e6455abf-22f9-4a9a-a942-b0fe9d848116',
		summary: {data: 'What is my name?'},
		author: 'Jack London',
		answers: [],
	};
	await t.throwsAsync(async () => {
		await (await Questions('test.json')).addQuestion(question);
	}, {
		instanceOf: Error,
		message: `Expected question.summary to be a string, got ${typeof question.summary}`,
	});

	question = {
		id: 'e6455abf-22f9-4a9a-a942-b0fe9d848116',
		author: 'Jack London',
		answers: [],
	};
	await t.throwsAsync(async () => {
		await (await Questions('test.json')).addQuestion(question);
	}, {
		instanceOf: Error,
		message: `Expected question.summary to be a string, got ${typeof question.summary}`,
	});

	question = {
		id: 'e6455abf-22f9-4a9a-a942-b0fe9d848116',
		summary: [],
		author: 'Jack London',
		answers: [],
	};
	await t.throwsAsync(async () => {
		await (await Questions('test.json')).addQuestion(question);
	}, {
		instanceOf: Error,
		message: `Expected question.summary to be a string, got ${typeof question.summary}`,
	});

	question = {
		id: 'e6455abf-22f9-4a9a-a942-b0fe9d848116',
		summary: 123,
		author: 'Jack London',
		answers: [],
	};
	await t.throwsAsync(async () => {
		await (await Questions('test.json')).addQuestion(question);
	}, {
		instanceOf: Error,
		message: `Expected question.summary to be a string, got ${typeof question.summary}`,
	});
});

test.serial('Should add question to data/test.json', async t => {
	const questions = await Questions('test.json');
	const question = {
		summary: 'What is moon?',
		author: 'Jack London Third',
	};

	await t.notThrowsAsync(async () => {
		await questions.addQuestion(question);
	});

	t.deepEqual((await questions.getQuestions())[0].author, question.author);
	t.deepEqual((await questions.getQuestions())[0].summary, question.summary);

	const testQuestions = [
		{
			id: 'e6455abf-22f9-4a9a-a942-b0fe9d848116',
			summary: 'What is my name?',
			author: 'Jack London',
			answers: [],
		},
		{
			id: '35c05570-622e-4008-a389-3694873e667a',
			summary: 'Who are you?',
			author: 'Tim Doods',
			answers: [],
		},
	];
	await writeFile('data/test.json',
		JSON.stringify(testQuestions, undefined, '  '),
		{
			encoding: 'utf8',
		});

	await t.notThrowsAsync(async () => {
		await questions.addQuestion(question);
	});

	t.deepEqual((await questions.getQuestions()).length, testQuestions.length + 1);
});
