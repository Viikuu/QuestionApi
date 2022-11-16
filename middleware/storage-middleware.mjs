import Questions from '../controllers/questions.mjs';

const questionStorage = fileName => async (request, response, next) => {
	request = {...request, questionsRepo: await Questions(fileName)};
	next();
};

export default questionStorage;
