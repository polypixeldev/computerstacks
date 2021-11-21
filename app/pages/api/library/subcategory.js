import getDb from '../../../db/mongoose';

async function subcategory(req, res) {
	const { subcategories } = await getDb();

	let data = await subcategories.findOne(
		{ uri: req.query.uri },
		'name description resources'
	);
	await data.populate('resources', 'name uri level');
	data = data.toObject();

	const level1 = data.resources.filter((resource) => resource.level === 1);
	const level2 = data.resources.filter((resource) => resource.level === 2);
	const level3 = data.resources.filter((resource) => resource.level === 3);

	return res.json({
		subcategory: data.name,
		description: data.description,
		resources: [level1, level2, level3],
	});
}

export default subcategory;
