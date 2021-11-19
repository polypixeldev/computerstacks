import getDb from "../../../db/mongoose";

async function roadmap(req, res) {
	const { roadmaps } = await getDb();

	let data = await roadmaps.findOne(
		{ uri: req.query.uri },
		"name description image comments"
	);

	await data.populate("comments");
	await data.populate("comments.author");

	return res.json(data.toObject());
}

export default roadmap;
