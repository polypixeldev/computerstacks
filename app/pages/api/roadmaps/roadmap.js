import getDb from "../../../db/mongoose";

async function roadmap(req, res) {
	const { roadmaps } = await getDb();

	let data = await roadmaps.findOne(
		{ uri: req.query.uri },
		"name description image comments",
		{ lean: true }
	);

	return res.json(data);
}

export default roadmap;
