import getDb from '../db/mongoose';

async function librarySubcategory(uri) {
	const { subcategories } = await getDb();

	let data = await subcategories.findOne(
		{ uri: uri },
		'name description resources'
	);
	await data.populate('resources', '-_id -parent name description uri level');
	console.log(data);
	data = data.toObject();

	const level1 = data.resources.filter((resource) => resource.level === 1);
	const level2 = data.resources.filter((resource) => resource.level === 2);
	const level3 = data.resources.filter((resource) => resource.level === 3);

	return {
		subcategory: data.name,
		description: data.description,
		resources: [level1, level2, level3],
	};
}

export default librarySubcategory;
