import getDb from "../../../db/mongoose";
import { getSession } from "next-auth/react";

async function comment(req, res) {
	const { roadmaps, comments } = await getDb();
	const session = await getSession({ req });

	const newComment = await comments.create({
		content: req.body.content,
		author: session.user._id,
		timestamp: Date.now(),
	});

	await roadmaps.updateOne(
		{ uri: req.body.uri },
		{
			$push: {
				comments: newComment._id,
			},
		}
	);

	return res.status(200).end();
}

export default comment;
