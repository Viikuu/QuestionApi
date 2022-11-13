import { unlink } from 'fs/promises';
import test from 'ava';
import { faker } from '@faker-js/faker';
import Questions from '../controllers/questions.mjs';

test.beforeEach(async () => {
	await Questions('test.json');
})

test.afterEach(async () => {
	await unlink('data/test.json');
})

test('Should return empty list when no questions were created', async t => {
	t.deepEqual(await (await Questions('test.json')).getQuestions(), []);
});