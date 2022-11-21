import express from 'express';
import questionStorage from './middleware/storage-middleware.mjs';
import {questionRouter} from './routers/question-router.mjs';

function app_init(STORAGE_FILE_PATH) {


	const app = express();

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(questionStorage(STORAGE_FILE_PATH));

	app.use('/questions', questionRouter);

	app.get('/', (_, res) => {
		res.json({ message: 'Welcome to responder!' });
	});

	return app;
}

export default app_init;
