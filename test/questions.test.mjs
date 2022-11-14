import {unlink, writeFile} from 'fs/promises';
import test from 'ava';
import { faker } from '@faker-js/faker';
import Questions from '../controllers/questions.mjs';

test.beforeEach(async () => {
	await writeFile('data/test.json', JSON.stringify([], undefined, '  '), { encoding: 'utf-8' });
})

test.after(async () => {
	await unlink('data/test.json');
})

test.serial('Should return empty list when no questions were created', async t => {
	t.deepEqual(await (await Questions('test.json')).getQuestions(), []);
});

test.serial('Should return list of questions which are in a test.json file', async t => {
	const testQuestions = [
		{
			id: 'e6455abf-22f9-4a9a-a942-b0fe9d848116',
			summary: 'What is my name?',
			author: 'Jack London',
			answers: []
		},
		{
			id: '35c05570-622e-4008-a389-3694873e667a',
			summary: 'Who are you?',
			author: 'Tim Doods',
			answers: []
		}
	];
	await writeFile('data/test.json', JSON.stringify(testQuestions, undefined, '  '), { encoding: 'utf-8' });

	t.deepEqual(await (await Questions('test.json')).getQuestions(), testQuestions);
});

test.serial('Should return undefined when question with specified id does not exist', async t => {
	const testQuestions = [
		{
			id: faker.datatype.uuid(),
			summary: 'What is my name?',
			author: 'Jack London',
			answers: []
		},
		{
			id: faker.datatype.uuid(),
			summary: 'Who are you?',
			author: 'Tim Doods',
			answers: []
		}
	];

	t.deepEqual(await (await Questions('test.json')).getQuestionById(faker.datatype.uuid()), undefined);

	await writeFile('data/test.json', JSON.stringify(testQuestions, undefined, '  '), { encoding: 'utf-8' });

	t.deepEqual(await (await Questions('test.json')).getQuestionById(faker.datatype.uuid()), undefined);
});