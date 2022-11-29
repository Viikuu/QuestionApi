import http from 'node:http';
import {unlink, writeFile} from 'node:fs/promises';
import test from 'ava';
import got from 'got';
import {faker} from '@faker-js/faker';
import listen from 'test-listen';
import appInit from '../app.mjs';


test.before(async t => {
	const app = appInit('testError2.json');
	t.context.server = http.createServer(app);
	t.context.prefixUrl = await listen(t.context.server);
});

test.beforeEach(async () => {
	await writeFile('data/testError2.json', JSON.stringify([
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
});

test.after.always(async t => {
	t.context.server.close();
	await unlink('data/testError2.json');
});

test.serial('get /questions/:questionId/answers error - Question with specified id does not exist', async t => {
	try {
		await got(`questions/${faker.datatype.uuid()}/answers`, {
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

test.serial('post /questions/:questionId/answers error - Question with specified id does not exist', async t => {
	try {
		await got.post(`questions/${faker.datatype.uuid()}/answers`, {
			prefixUrl: t.context.prefixUrl,
			retry: {
				limit: 0,
			},
			json: {
				author: 'Dr Strange',
				summary: 'It is egg-shaped.',
			}
		});
	} catch (error) {
		t.is(error.response.statusCode, 404);
		t.deepEqual(JSON.parse(error.response.body), {success: false, message: 'Question with specified id does not exist'});
	}
});

test.serial('post /questions/:questionId/answers error - Expected answer to be an object, got object ', async t => { //Array
	try {
		await got.post(`questions/e6455abf-22f9-4a9a-a942-b0fe9d848116/answers`, {
			prefixUrl: t.context.prefixUrl,
			retry: {
				limit: 0,
			},
			json: [],
		});
	} catch (error) {
		t.is(error.response.statusCode, 400);
		t.deepEqual(JSON.parse(error.response.body), {success: false, message: 'Expected answer to be an object, got object'});
	}
});

test.serial('post /questions/:questionId/answers error - Expected answer.author to be a string, got undefined ', async t => {
	try {
		await got.post(`questions/e6455abf-22f9-4a9a-a942-b0fe9d848116/answers`, {
			prefixUrl: t.context.prefixUrl,
			retry: {
				limit: 0,
			},
			json: {},
		});
	} catch (error) {
		t.is(error.response.statusCode, 400);
		t.deepEqual(JSON.parse(error.response.body),
			{
				success: false,
				message: 'Expected answer.author to be a string, got undefined',
			});
	}
});

test.serial('post /questions/:questionId/answers error - Expected answer.author to be a string, got number ', async t => {
	try {
		await got.post(`questions/e6455abf-22f9-4a9a-a942-b0fe9d848116/answers`, {
			prefixUrl: t.context.prefixUrl,
			retry: {
				limit: 0,
			},
			json: {
				author:123,
			},
		});
	} catch (error) {
		t.is(error.response.statusCode, 400);
		t.deepEqual(JSON.parse(error.response.body),
			{
				success: false,
				message: 'Expected answer.author to be a string, got number',
			});
	}
});

test.serial('post /questions/:questionId/answers error - Expected answer.author to be a string, got object ', async t => {
	try {
		await got.post(`questions/e6455abf-22f9-4a9a-a942-b0fe9d848116/answers`, {
			prefixUrl: t.context.prefixUrl,
			retry: {
				limit: 0,
			},
			json: {
				author:[],
			},
		});
	} catch (error) {
		t.is(error.response.statusCode, 400);
		t.deepEqual(JSON.parse(error.response.body),
			{
				success: false,
				message: 'Expected answer.author to be a string, got object',
			});
	}
});
