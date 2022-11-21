import Questions from '../controllers/questions.mjs';

const questionStorage = fileName => async (request, response, next) => {
	request.questionsRepo = await Questions(fileName);
	next();
};

export default questionStorage;
