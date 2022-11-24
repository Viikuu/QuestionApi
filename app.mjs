import express from 'express';
import questionStorage from './middleware/storage-middleware.mjs';
import {questionRouter} from './routers/question-router.mjs';
import errorHandler from './middleware/error-middleware.mjs';

function appInit(STORAGE_FILE_PATH) {
	const app = express();

	app.use(express.urlencoded({extended: true}));
	app.use(express.json());
	app.use(questionStorage(STORAGE_FILE_PATH));

	app.use('/questions', questionRouter);

	app.get('/', (_, response) => {
		response.json({message: 'Welcome to responder!'});
	});

	app.use(errorHandler);

	return app;
}

export default appInit;
