import ApiError from '../utils/customError.mjs';

export default function errorHandler(error, request, response, next) {
	if (response.headersSent) {
		return next(error);
	}
	const arr = [
		'Answer with specified id does not exist',
		`Question with specified id does not exist`,
	];
	if (error instanceof ApiError) {
		if (arr.includes(error.message)) {
			response.status(404);
		}else if (error.message === `Question object damaged!`) {
			response.status(500);
		} else {
			response.status(400);
		}
		response.json({success: false, message: error.message});
		return;
	}
	response.status(500).send({error: 'Something failed!'});
};
