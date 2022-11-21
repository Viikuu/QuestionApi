import http from 'http';
import test from 'ava';
import got from 'got';
import listen from 'test-listen';
import app_init from '../app.mjs';

test.before(async t => {
	const app = app_init('test3.json')
	t.context.server = http.createServer(app);
	t.context.prefixUrl = await listen(t.context.server);
});

test.after.always(t => {
	t.context.server.close();
});

test.serial('get /', async t => {
	const message = await got('', {prefixUrl: t.context.prefixUrl}).json();
	t.deepEqual(message, { message: 'Welcome to responder!' });
});

test.serial('get /questions', async t => {
	const message = await got('questions/', {prefixUrl: t.context.prefixUrl}).json();
	t.deepEqual(message, {success: true, questions: []});
});
