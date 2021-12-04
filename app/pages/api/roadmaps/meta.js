import getDb from '../../../db/mongoose';

async function meta(req, res) {
	const { roadmaps } = await getDb();
	const queries = [
		roadmaps.estimatedDocumentCount(),
		roadmaps.find({}, 'name description uri level', { lean: true }),
	];
	const [numRoadmaps, roadmapsArr] = await Promise.all(queries);

	const level1 = roadmapsArr.filter((roadmap) => roadmap.level === 1);
	const level2 = roadmapsArr.filter((roadmap) => roadmap.level === 2);
	const level3 = roadmapsArr.filter((roadmap) => roadmap.level === 3);

	return res.json({
		numRoadmaps,
		roadmaps: [level1, level2, level3],
	});
}

export default meta;
