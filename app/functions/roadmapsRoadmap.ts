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
	}));

	dataObj.comments = dataObj.comments.map((comment) => ({
		_id: comment._id,
		content: comment.content,
		author: {
			emailVerified: comment.author.emailVerified,
			name: comment.author.name,
			email: comment.author.email,
			image: comment.author.image,
			roadmaps: comment.author.roadmaps,
			favorites: comment.author.favorites
		},
		timestamp: comment.timestamp
	}));

	dataObj.comments.reverse();

	return dataObj;
}

export default roadmapsRoadmap;
