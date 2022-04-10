import getDb from '../db/mongoose';

async function roadmapsRoadmap(uri) {
	const { roadmaps } = await getDb();

	let data = await roadmaps.findOne(
		{ uri: uri },
		'-_id name description image comments'
	);

	await data.populate({
		path: 'comments',
		populate: {
			path: 'author',
		},
	});

	const obj = data.toObject();

	obj.comments.reverse();

	return obj;
}

export default roadmapsRoadmap;
