import getDb from '../db/mongoose';

async function libraryResource(uri) {
	const { resources } = await getDb();

	let data = await resources.findOne(
		{ uri: uri },
		'-_id name description teamRating communityRating link author timestamp comments'
	);

	await data.populate({
		path: 'comments',
		populate: {
			path: 'author',
		},
	});

	let obj = data.toObject();

	obj.comments.reverse();

	obj.timestamp = obj.timestamp.toISOString();

	return obj;
}

export default libraryResource;
