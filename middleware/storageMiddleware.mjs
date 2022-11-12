import {questions} from '../controllers/questions.mjs';

export default (fileName) => async (req, res, next) => {
	req = {...req, questionsRepo: await questions(fileName) };
	next()
}