import getDb from "../../../db/mongoose";

async function resource(req, res) {
	const { resources } = await getDb();

	let data = await resources.findOne(
		{ uri: req.query.uri },
		"name description teamRating communityRating link author timestamp comments"
	);

	await data.populate("comments");
	await data.populate("comments.author");

	return res.json(data.toObject());
}

export default resource;
