import ApiError from '../utils/customError.mjs';

export default function errorHandler (error, request, response, next) {
	if (response.headersSent) {
		return next(error);
	}
	if (error instanceof ApiError) {
		response.status(500).json({success: false, message: error.message })
		return;
	}
	response.status(500).send({ error: 'Something failed!' })
};
