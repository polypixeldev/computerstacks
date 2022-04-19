import getDb from '../db/mongoose';

import Comment from '../interfaces/db/Comment';

async function libraryResource(uri: string) {
	const { resources } = await getDb();

	const data = await resources.findOne(
		{ uri: uri },
		'-_id name description teamRating communityRating link author timestamp comments'
	);

	if (!data) {
		throw new Error(`Resource URI ${uri} does not exist`);
	}

	const dataObj = (await data.populate<{ comments: Comment[] }>({
		path: 'comments',
		populate: {
			path: 'author',
		},
	})).toObject();

	dataObj.comments.reverse();

	return {
		...dataObj,
		timestamp: dataObj.timestamp.toISOString()
	};
}

export default libraryResource;
