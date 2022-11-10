import express from 'express';
import { urlencoded, json } from 'body-parser';
import {questionRouter} from './routers/questionRouter.mjs';

const STORAGE_FILE_PATH = 'questions.json';
const PORT = 3000;

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

app.use('/questions', questionRouter);


app.get('/', (_, res) => {
	res.json({ message: 'Welcome to responder!' })
})

app.listen(PORT, () => {
	console.log(`Responder app listening on port ${PORT}`)
})