import express from 'express';
import {answerRouter} from './answerRouter.mjs';

const app = express.Router();

app.get('/', async (request, response) => {
	const questions = await request.questionsRepo.getQuestions();
	response.json({success: true, questions});
})

app.get('/:questionId', async (request, response) => {
	const {questionId} = request.params;
	const question = await request.questionsRepo.getQuestionById(questionId);
	if(question === undefined) {
		response.code(404).json({ success: false, error: {message: `Question with specified Id doesn't exist`}});
		return;
	}
	response.json({success: true, question});
})

app.post('/', async (request, response) => {
	const question = request.body
	await request.questionsRepo.addQuestion(question)
	response.json({success: true, question})
})

app.use(answerRouter);

export {
	app as questionRouter,
}
