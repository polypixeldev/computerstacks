import getDb from '../db/mongoose';

async function libraryCategory(uri) {
	const { categories } = await getDb();

	let data = await categories.findOne(
		{ uri: uri },
		'name description subcategories'
	);
	await data.populate(
		'subcategories',
		'-_id -parent name description uri level'
	);
	data = data.toObject();

	const level1 = data.subcategories.filter((subcat) => subcat.level === 1);
	const level2 = data.subcategories.filter((subcat) => subcat.level === 2);
	const level3 = data.subcategories.filter((subcat) => subcat.level === 3);

	return {
		category: data.name,
		description: data.description,
		subcategories: [level1, level2, level3],
	};
}

export default libraryCategory;
