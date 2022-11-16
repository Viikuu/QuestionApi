import Storage from './storage.mjs';
import { v4 as uuidv4 } from 'uuid';

export default async function Questions(fileName) {
	const storage = await Storage(fileName);

	const checkQuestion = (question) => {
		if (typeof question !== 'object' || Array.isArray(question)) {
			throw new Error(`Question with specified id does not exist!`);
		}
		if (typeof question.author !== 'string' || typeof question.summary !== 'string' || !Array.isArray(question.answers)) {
			throw new Error(`Question object damaged!`);
		}
	}

	const getQuestions = async () => {
		const questions = await storage.getData();
		if (questions === undefined) {
			return [];
		}
		return questions;
	}

	const getQuestionById = async questionId => {
		const questions = await getQuestions();

		return questions.find(question => question.id === questionId);
	}

	const addQuestion = async question => {
		let questions = await getQuestions();
		if (typeof question !== 'object' || Array.isArray(question)) {
			throw new Error(`Expected question to be an object, got ${typeof question}`);
		}
		if (typeof question.author !== 'string') {
			throw new Error(`Expected question.author to be a string, got ${typeof question.author}`);
		}
		if (typeof question.summary !== 'string') {
			throw new Error(`Expected question.summary to be a string, got ${typeof question.summary}`);
		}

		questions.push({
			id: uuidv4(),
			author: question.author,
			summary: question.summary,
			answers: [],
		});
		await storage.saveData(questions);
	}

	const getAnswers = async questionId => {
		const question = await getQuestionById(questionId);

		checkQuestion(question);

		return question.answers;
	}

	const getAnswer = async (questionId, answerId) => {
		const answers = await getAnswers(questionId);

		return answers.find(answer => answer.id === answerId);
	}

	const addAnswer = async (questionId, answer) => {
		const questions = await getQuestions();
		const question = questions.find(question => question.id === questionId);

		checkQuestion(question);

		if (typeof answer !== 'object' || Array.isArray(answer)) {
			throw new Error(`Expected answer to be an object, got ${typeof answer}`);
		}
		if (typeof answer.author !== 'string') {
			throw new Error(`Expected answer.author to be a string, got ${typeof answer.author}`);
		}
		if (typeof answer.summary !== 'string') {
			throw new Error(`Expected answer.summary to be a string, got ${typeof answer.summary}`);
		}

		question.answers.push({
				id: uuidv4(),
				author: answer.author,
				summary: answer.summary,
			}
		);

		await storage.saveData(questions);
}

	return {
		getQuestions,
		getQuestionById,
		addQuestion,
		getAnswers,
		getAnswer,
		addAnswer,
	}

}
