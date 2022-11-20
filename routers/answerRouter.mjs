import express from 'express';

const app = express.Router();

app.get('/:questionId/answers', async (request, response, next) => {
	const { questionId } = request.params;
	try{
		const answers = await request.questionsRepo.getAnswers(questionId);
		response.json({ success: true, answers });
	} catch (error) {
		next(error);
	}
})

app.post('/:questionId/answers',async (req, res) => {

})

app.get('/:questionId/answers/:answerId', async (req, res) => {

})

export {
	app as answerRouter,
}