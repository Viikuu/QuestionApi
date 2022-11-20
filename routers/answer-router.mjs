import express from 'express';

const app = express.Router();

app.get('/:questionId/answers', async (request, response, next) => {
	const {questionId} = request.params;
	try {
		const answers = await request.questionsRepo.getAnswers(questionId);
		response.json({success: true, answers});
	} catch (error) {
		next(error);
	}
});

app.post('/:questionId/answers', async (request, response, next) => {
	const {questionId} = request.params;
	const answer = request.body;
	try {
		await request.questionsRepo.addAnswer(questionId, answer);
		response.json({success: true, answer});
	} catch (error) {
		next(error);
	}
});

app.get('/:questionId/answers/:answerId', async (request, response, next) => {
	const {questionId, answerId} = request.params;
	try {
		const answer = await request.questionsRepo.getAnswer(questionId, answerId);
		response.json({success: true, answer});
	} catch (error) {
		next(error);
	}
});

export {
	app as answerRouter,
};
