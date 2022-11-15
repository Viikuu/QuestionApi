import {unlink, writeFile} from 'node:fs/promises';
import test from 'ava';
import {faker} from '@faker-js/faker';
import Questions from '../controllers/questions.mjs';

test.after(async () => {
	await unlink('data/test2.json');
});

test.beforeEach(async () => {
	await writeFile('data/test2.json', JSON.stringify([], undefined, '  '), {encoding: 'utf8'});
});

test.serial('Should return empty array when no answers are added', async t => {
	const questions = await Questions('test2.json');
	let question = {
		summary: 'What is moon?',
		author: 'Jack London Third',
	};
	await questions.addQuestion(question);

	t.deepEqual(await questions.getAnswers((await questions.getQuestions())[0].id), []);

});

