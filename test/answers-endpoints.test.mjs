import http from 'node:http';
import {unlink, writeFile} from 'node:fs/promises';
import test from 'ava';
import got from 'got';
import listen from 'test-listen';
import appInit from '../app.mjs';

test.before(async t => {
	const app = appInit('test4.json');
	t.context.server = http.createServer(app);
	t.context.prefixUrl = await listen(t.context.server);

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

	await writeFile('data/test4.json',
		JSON.stringify(testQuestions, undefined, '  '),
		{
			encoding: 'utf8',
		});
});

test.after.always(async t => {
	t.context.server.close();
	await unlink('data/test4.json');
});

test.serial('get /questions/:questionId/answers empty answer array', async t => {
	const message = await got('questions/e6455abf-22f9-4a9a-a942-b0fe9d848116/answers',
		{
			prefixUrl: t.context.prefixUrl,
		}).json();
	t.deepEqual(message,
		{
			success: true,
			answers: [],
		});
});

test.serial('get /questions/:questionId/answers', async t => {
	const answer = {
		id: 'f4325fw4-22f9-4a9a-a942-b0fe9d848116',
		author: 'Dr Strange',
		summary: 'It is egg-shaped.',
	};

	const testQuestions = [
		{
			id: 'e6455abf-22f9-4a9a-a942-b0fe9d848116',
			summary: 'What is my name?',
			author: 'Jack London',
			answers: [answer],
		},
		{
			id: '35c05570-622e-4008-a389-3694873e667a',
			summary: 'Who are you?',
			author: 'Tim Doods',
			answers: [],
		},
	];

	await writeFile('data/test4.json',
		JSON.stringify(testQuestions, undefined, '  '),
		{encoding: 'utf8'});

	const message = await got('questions/e6455abf-22f9-4a9a-a942-b0fe9d848116/answers',
		{
			prefixUrl: t.context.prefixUrl,
		}).json();
	t.deepEqual(message, {
		success: true,
		answers: [answer],
	});
});

test.serial('post /questions/:questionId/answers', async t => {
	const answer = {
		author: 'Dr Strange',
		summary: 'It is egg-shaped.',
	};

	await t.notThrowsAsync(async () => {
		await got.post('questions/e6455abf-22f9-4a9a-a942-b0fe9d848116/answers',
			{
				prefixUrl: t.context.prefixUrl,
				json: answer,
			});
	});
});

test.serial('get /questions/:questionId/answers/:answerId', async t => {
	const answer = {
		id: 'f4325fw4-22f9-4a9a-a942-b0fe9d848116',
		author: 'Dr Strange',
		summary: 'It is egg-shaped.',
	};

	const testQuestions = [
		{
			id: 'e6455abf-22f9-4a9a-a942-b0fe9d848116',
			summary: 'What is my name?',
			author: 'Jack London',
			answers: [answer],
		},
		{
			id: '35c05570-622e-4008-a389-3694873e667a',
			summary: 'Who are you?',
			author: 'Tim Doods',
			answers: [],
		},
	];

	await writeFile('data/test4.json',
		JSON.stringify(testQuestions, undefined, '  '),
		{
			encoding: 'utf8',
		});

	await t.notThrowsAsync(async () => {
		const message = await got('questions/e6455abf-22f9-4a9a-a942-b0fe9d848116/answers/f4325fw4-22f9-4a9a-a942-b0fe9d848116',
			{
				prefixUrl: t.context.prefixUrl,
			}).json();
		t.deepEqual(message,
			{
				success: true,
				answer,
			});
	});
});

