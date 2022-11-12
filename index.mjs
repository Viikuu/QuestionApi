import express from 'express';
import {questionRouter} from './routers/questionRouter.mjs';
import questionStorage from './middleware/storageMiddleware.mjs';

const STORAGE_FILE_PATH = 'questions.json';
const PORT = 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(questionStorage(STORAGE_FILE_PATH));

app.use('/questions', questionRouter);


app.get('/', (_, res) => {
	res.json({ message: 'Welcome to responder!' });
})

app.listen(PORT, async () => {
	console.log(`Responder app listening on port ${PORT}`);
})