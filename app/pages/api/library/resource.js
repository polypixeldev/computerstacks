import getDb from "../../../db/mongoose";

async function resource(req, res) {
	const { resources } = await getDb();

	let data = await resources.findOne(
		{ uri: req.query.uri },
		"name description teamRating communityRating link author timestamp comments"
	);

	await data.populate({
		path: "comments",
		populate: {
			path: "author",
		},
	});

	const obj = data.toObject();

	obj.comments.reverse();

	return res.json(obj);
}

export default resource;
