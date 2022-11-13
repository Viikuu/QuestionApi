import Questions from '../controllers/questions.mjs';

export default (fileName) => async (req, res, next) => {
	req = {...req, questionsRepo: await Questions(fileName) };
	next()
}