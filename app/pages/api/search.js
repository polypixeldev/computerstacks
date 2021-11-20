import getDb from "../../db/mongoose";

async function search(req, res) {
	const { resources, roadmaps } = await getDb();

	const queryRegex = new RegExp(req.query.query, "ig");

	let queries = [
		resources.find(
			{
				$or: [
					{ name: queryRegex },
					{ description: queryRegex },
					{ author: queryRegex },
				],
			},
			"name description uri"
		),
		roadmaps.find(
			{ $or: [{ name: queryRegex }, { description: queryRegex }] },
			"name description uri"
		),
	];

	const [resource, roadmap] = await Promise.all(queries);

	res.json({
		resource,
		roadmap,
	});
}

export default search;
