import appInit from './app.mjs';

const STORAGE_FILE_PATH = 'questions.json';

const app = appInit(STORAGE_FILE_PATH);
const PORT = 3000;

app.listen(PORT, async () => {
	console.log(`Responder app listening on port ${PORT}`);
});
