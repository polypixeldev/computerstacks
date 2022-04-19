import getDb from '../db/mongoose';

import { DbSubcategory } from '../interfaces/db/Subcategory';

async function libraryCategory(uri: string) {
	const { categories } = await getDb();

	let data = await categories.findOne(
		{ uri: uri },
		'name description subcategories'
	);

	if (!data) {
		throw new Error(`Category URI ${uri} does not exist`);
	}

	let dataObj = (await data.populate<{ subcategories: DbSubcategory[] }>(
		'subcategories',
		'-_id -parent name description uri level'
	)).toObject();

	const level1 = dataObj.subcategories.filter((subcat) => subcat.level === 1);
	const level2 = dataObj.subcategories.filter((subcat) => subcat.level === 2);
	const level3 = dataObj.subcategories.filter((subcat) => subcat.level === 3);

	return {
		name: data.name,
		description: data.description,
		subcategories: [level1, level2, level3],
	};
}

export default libraryCategory;
