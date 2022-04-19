import getDb from '../db/mongoose';

import { DbResource } from '../interfaces/db/Resource';

async function librarySubcategory(uri: string) {
	const { subcategories } = await getDb();

	let data = await subcategories.findOne(
		{ uri: uri },
		'name description resources'
	);

	if (!data) {
		throw new Error(`Subcategory URI ${uri} does not exist`);
	}

	let dataObj = (await data.populate<{ resources: DbResource[] }>('resources', '-_id -parent name description uri level')).toObject();

	const level1 = dataObj.resources.filter((resource) => resource.level === 1);
	const level2 = dataObj.resources.filter((resource) => resource.level === 2);
	const level3 = dataObj.resources.filter((resource) => resource.level === 3);

	return {
		name: data.name,
		description: data.description,
		resources: [level1, level2, level3],
	};
}

export default librarySubcategory;
