import http from 'http';
import test from 'ava';
import got from 'got';
import listen from 'test-listen';
import app_init from '../app.mjs';
import {unlink} from 'node:fs/promises';

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
