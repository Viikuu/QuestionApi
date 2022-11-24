import http from 'node:http';
import {unlink, writeFile} from 'node:fs/promises';
import test from 'ava';
import got from 'got';
import listen from 'test-listen';
import {faker} from '@faker-js/faker';
import appInit from '../app.mjs';

test.before(async t => {
	const app = appInit('testError.json');
	t.context.server = http.createServer(app);
	t.context.prefixUrl = await listen(t.context.server);
});

test.after.always(async t => {
	t.context.server.close();
	await unlink('data/testError.json');
});

test.serial('post /questions error - Expected question.summary to be a string, got undefined', async t => {
	const response = await got.post('questions/', {
		prefixUrl: t.context.prefixUrl,
		throwHttpErrors: false,
		json: {
			author: 'Jack London',
		},
	});
	t.is(response.statusCode, 400);
	t.deepEqual(JSON.parse(response.body), {
		success: false,
		message: 'Expected question.summary to be a string, got undefined',
	});
});

test.serial('post /questions error - Expected question.author to be a string, got undefined', async t => {
	const response = await got.post('questions/', {
		prefixUrl: t.context.prefixUrl,
		throwHttpErrors: false,
		json: {
			summary: 'What is tost?',
		},
	});
	t.is(response.statusCode, 400);
	t.deepEqual(JSON.parse(response.body), {success: false, message: 'Expected question.author to be a string, got undefined'});

	const response1 = await got.post('questions/', {
		prefixUrl: t.context.prefixUrl,
		throwHttpErrors: false,
		json: {},
	});
	t.is(response1.statusCode, 400);
	t.deepEqual(JSON.parse(response1.body), {success: false, message: 'Expected question.author to be a string, got undefined'});
});

test.serial('post /questions error - Expected question to be an object, got object', async t => {
	const response = await got.post('questions/', {
		prefixUrl: t.context.prefixUrl,
		throwHttpErrors: false,
		json: [],
	});
	t.is(response.statusCode, 400);
	t.deepEqual(JSON.parse(response.body), {success: false, message: 'Expected question to be an object, got object'});
});

test.serial('get /questions/:questionId error - Question with specified id does not exist - empty file', async t => {
	try {
		await got(`questions/${faker.datatype.uuid()}`, {
			prefixUrl: t.context.prefixUrl,
			retry: {
				limit: 0,
			},
		});
	} catch (error) {
		t.is(error.response.statusCode, 404);
		t.deepEqual(JSON.parse(error.response.body), {success: false, message: 'Question with specified id does not exist'});
	}
});

test.serial('get /questions/:questionId error - Question with specified id does not exist - random uuid', async t => {
	await writeFile('data/testError.json', JSON.stringify([
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
	], undefined, '  '), {encoding: 'utf8'});

	try {
		await got(`questions/${faker.datatype.uuid()}`, {
			prefixUrl: t.context.prefixUrl,
			retry: {
				limit: 0,
			},
		});
	} catch (error) {
		t.is(error.response.statusCode, 404);
		t.deepEqual(JSON.parse(error.response.body), {success: false, message: 'Question with specified id does not exist'});
	}
});

test.serial('get /questions/:questionId error - Question object damaged!', async t => {
	const id = 'e6455abf-22f9-4a9a-a942-b0fe9d848116';

	await writeFile('data/testError.json', JSON.stringify([
		{
			id,
		},
	], undefined, '  '), {encoding: 'utf8'});

	try {
		await got(`questions/${id}`, {
			prefixUrl: t.context.prefixUrl,
			retry: {
				limit: 0,
			},
		});
	} catch (error) {
		t.is(error.response.statusCode, 500);
		t.deepEqual(JSON.parse(error.response.body), {success: false, message: 'Question object damaged!'});
	}
});
