import express from 'express';
import {answerRouter} from './answer-router.mjs';

const app = express.Router();

app.get('/', async (request, response) => {
	const questions = await request.questionsRepo.getQuestions();
	response.json({success: true, questions});
});

app.get('/:questionId', async (request, response, next) => {
	const {questionId} = request.params;
	try {
		const question = await request.questionsRepo.getQuestionById(questionId);
		response.json({success: true, question});
	} catch (error) {
		next(error);
	}
});

app.post('/', async (request, response) => {
	const question = request.body;
	await request.questionsRepo.addQuestion(question);
	response.json({success: true, question});
});

app.use(answerRouter);

export {
	app as questionRouter,
};
