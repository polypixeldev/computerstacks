import getDb from "../../../db/mongoose";

async function roadmap(req, res) {
	const { roadmaps } = await getDb();

	let data = await roadmaps.findOne(
		{ uri: req.query.uri },
		"name description image comments"
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

export default roadmap;
