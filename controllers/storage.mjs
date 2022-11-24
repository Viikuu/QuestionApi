import {readFile, writeFile, access, mkdir} from 'node:fs/promises';

async function Storage(fileName) {
	if (fileName.split('.').at(-1).trim() !== 'json') {
		throw new Error('Specified file should be a JSON file');
	}

	fileName = `data/${fileName}`;
	try {
		await access(fileName);
	} catch {
		try {
			await mkdir('data');
		} catch (error) {
			if (error.code !== 'EEXIST') {
				throw error;
			}
		}

		await saveData([]);
	}

	async function saveData(data) {
		await writeFile(fileName, JSON.stringify(data, undefined, '  '), {encoding: 'utf8'});
	}

	async function getData() {
		const fileContent = await readFile(fileName, {encoding: 'utf8'});
		return JSON.parse(fileContent);
	}

	return {
		saveData,
		getData,
	};
}

export default Storage;
