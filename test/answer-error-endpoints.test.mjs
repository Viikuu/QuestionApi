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

test.beforeEach(async t => {
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
