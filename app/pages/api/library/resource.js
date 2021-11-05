import getDb from "../../../db/mongoose";

async function resource(req, res) {
	const { resources } = await getDb();

	let data = await resources.findOne(
		{ uri: req.query.uri },
		"name description teamRating communityRating link author timestamp comments",
		{ lean: true }
	);

	return res.json(data);
}

export default resource;
