import { readFile, writeFile, access, mkdir } from 'fs/promises';

async function Storage (fileName) {
	fileName = `../data/${fileName}`;
	try {
		await access(fileName);
	} catch {
		await mkdir(fileName);
	}

	async function saveData(data) {
		await writeFile(fileName, JSON.stringify(data, undefined, '  '), { encoding: 'utf-8' });
	}

	async function getData() {
		const fileContent = await readFile(fileName, { encoding: 'utf-8' });
		return JSON.parse(fileContent);
	}

	return {
		saveData,
		getData,
	};
}

export default Storage;
