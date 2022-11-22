import http from 'http';
import test from 'ava';
import got from 'got';
import listen from 'test-listen';
import app_init from '../app.mjs';
import {unlink, writeFile} from 'node:fs/promises';
test.before(async t => {
	const app = app_init('test3.json')
	t.context.server = http.createServer(app);
	t.context.prefixUrl = await listen(t.context.server);
});

test.after.always(async t => {
	t.context.server.close();
	await unlink('data/test3.json');
});

test.serial('get /', async t => {
	const message = await got('', {prefixUrl: t.context.prefixUrl}).json();
	t.deepEqual(message, { message: 'Welcome to responder!' });
});

test.serial('get /questions empty questionRepo', async t => {
	const message = await got('questions/', {prefixUrl: t.context.prefixUrl}).json();
	t.deepEqual(message, {success: true, questions: []});
});

test.serial('post /questions', async t => {
	const question = {
		id: 'e6455abf-22f9-4a9a-a942-b0fe9d848116',
		summary: 'What is my name?',
		author: 'Jack London',
		answers: [],
	};
	await t.notThrowsAsync(async () => {
		await got.post('questions/', {prefixUrl: t.context.prefixUrl, json: question});
	});
});

test.serial('get /questions/:questionId', async t => {
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

	await writeFile('data/test3.json', JSON.stringify(testQuestions, undefined, '  '), {encoding: 'utf8'});

	await t.notThrowsAsync(async () => {
		const question = await got('questions/e6455abf-22f9-4a9a-a942-b0fe9d848116', {prefixUrl: t.context.prefixUrl}).json();
		t.deepEqual(question, {success: true, question: testQuestions[0]});
	});

	await t.notThrowsAsync(async () => {
		const question = await got('questions/35c05570-622e-4008-a389-3694873e667a', {prefixUrl: t.context.prefixUrl}).json();
		t.deepEqual(question, {success: true, question: testQuestions[1]});
	});
});
