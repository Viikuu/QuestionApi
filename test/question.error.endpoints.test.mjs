import http from 'http';
import test from 'ava';
import got from 'got';
import listen from 'test-listen';
import app_init from '../app.mjs';
import {unlink, writeFile} from 'node:fs/promises';

test.before(async t => {
	const app = app_init('testError.json')
	t.context.server = http.createServer(app);
	t.context.prefixUrl = await listen(t.context.server);
});

test.after.always(async t => {
	t.context.server.close();
	await unlink('data/testError.json');
});
test.serial('post /questions error', async t => {
	const test = async (question, code, message) => {
		const response = await got.post('questions/', {
			prefixUrl: t.context.prefixUrl,
			throwHttpErrors: false,
			json: question,
		});
		t.is(response.statusCode, code);
		t.deepEqual(JSON.parse(response.body), {success: false, message});
	}

	await test({
		author: 'Jack London',
	}, 400,
		"Expected question.summary to be a string, got undefined");

	await test({
		summary: 'What is tost?',
	}, 400,
		"Expected question.author to be a string, got undefined");

	await test({},
		400,
		"Expected question.author to be a string, got undefined");

	await test([],
		400,
		'Expected question to be an object, got object');
});

