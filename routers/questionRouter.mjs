import express from 'express';
import {answerRouter} from './answerRouter.mjs';

const app = express.Router();

app.get('/', async (request, response) => {
	const questions = await request.questionsRepo.getQuestions();
	response.json({success: true, questions});
})

app.get('/:questionId', async (req, res) => {

})

app.post('/', async (req, res) => {

})

app.use(answerRouter);

export {
	app as questionRouter,
}
