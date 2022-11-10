import express from 'express';

const app = express.Router();

app.get('/:questionId/answers', async (req, res) => {

})

app.post('/:questionId/answers',async (req, res) => {

})

app.get('/:questionId/answers/:answerId', async (req, res) => {

})

export {
	app as answerRouter,
}