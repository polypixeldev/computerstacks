import getDb from '../../../db/mongoose';

async function meta(req, res) {
	const { categories, resources } = await getDb();
	const queries = [
		resources.estimatedDocumentCount(),
		categories.estimatedDocumentCount(),
		categories.find({}, 'name description uri level', { lean: true }),
	];
	const [numResources, numSubjects, subjects] = await Promise.all(queries);

	const level1 = subjects.filter((subject) => subject.level === 1);
	const level2 = subjects.filter((subject) => subject.level === 2);
	const level3 = subjects.filter((subject) => subject.level === 3);

	return res.json({
		numResources,
		numSubjects,
		subjects: [level1, level2, level3],
	});
}

export default meta;
