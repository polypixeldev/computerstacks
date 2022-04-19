import getDb from '../db/mongoose';

import Comment from '../interfaces/db/Comment';

async function roadmapsRoadmap(uri: string) {
	const { roadmaps } = await getDb();

	const data = await roadmaps.findOne(
		{ uri: uri },
		'-_id name description image comments'
	);

	if (!data) {
		throw new Error(`Roadmap URI ${uri} not found`);
	}

	const dataObj = (await data.populate<{ comments: Comment[] }>({
		path: 'comments',
		populate: {
			path: 'author',
		},
	})).toObject();

	dataObj.comments.reverse();

	return dataObj;
}

export default roadmapsRoadmap;
