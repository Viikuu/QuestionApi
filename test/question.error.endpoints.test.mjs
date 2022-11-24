import http from 'http';
import test from 'ava';
import got from 'got';
import listen from 'test-listen';
import app_init from '../app.mjs';
import {unlink, writeFile} from 'node:fs/promises';
import {faker} from '@faker-js/faker';

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

test.serial('get /questions/:questionId error', async t => {

	const test = async (code, message, uuid) => {
		try {
			const response = await got(`questions/${uuid}`, {
				prefixUrl: t.context.prefixUrl,
				retry: {
					limit: 0
				},
			});
		} catch (error) {
			t.is(error.response.statusCode, code);
			t.deepEqual(JSON.parse(error.response.body), {success: false, message});
		}
	}

	await test(404,
		'Question with specified id does not exist',
		faker.datatype.uuid());

	let testQuestions = [
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

	await writeFile('data/testError.json', JSON.stringify(testQuestions, undefined, '  '), {encoding: 'utf8'});

	await test(404,
		'Question with specified id does not exist',
		faker.datatype.uuid());

	const id = 'e6455abf-22f9-4a9a-a942-b0fe9d848116';

	await writeFile('data/testError.json', JSON.stringify([
		{
			id,
		},
	], undefined, '  '), {encoding: 'utf8'});

	await test(500,
		`Question object damaged!`,
		id);

});
