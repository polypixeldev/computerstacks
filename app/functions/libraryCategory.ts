import getDb from '../db/mongoose';

import { DbSubcategory } from '../interfaces/db/Subcategory';

async function libraryCategory(uri: string) {
	const { categories } = await getDb();

	const data = await categories.findOne(
		{ uri: uri },
		'name description subcategories'
	);

	if (!data) {
		throw new Error(`Category URI ${uri} does not exist`);
	}

	const dataObj = (await data.populate<{ subcategories: DbSubcategory[] }>(
		'subcategories',
		'-_id name description uri level parent'
	));

	const subcategories = dataObj.subcategories.map((subcat) => ({
		name: subcat.name,
		description: subcat.description,
		uri: subcat.uri,
		level: subcat.level
	}));

	const newDataObj = {
		name: dataObj.name,
		description: dataObj.description,
		subcategories: subcategories,
		level: dataObj.level
	}

	const level1 = newDataObj.subcategories.filter((subcat) => subcat.level === 1);
	const level2 = newDataObj.subcategories.filter((subcat) => subcat.level === 2);
	const level3 = newDataObj.subcategories.filter((subcat) => subcat.level === 3);

	return {
		name: data.name,
		description: data.description,
		subcategories: [level1, level2, level3],
	};
}

export default libraryCategory;
