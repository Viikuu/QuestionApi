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

});

test.after.always(async t => {
	t.context.server.close();
	await unlink('data/test3.json');
});

test.serial('get /questions/:questionId/answers empty answer array', async t => {
	const message = await got('questions/e6455abf-22f9-4a9a-a942-b0fe9d848116/answers', {prefixUrl: t.context.prefixUrl}).json();
	t.deepEqual(message, {success: true, answers: []});
});