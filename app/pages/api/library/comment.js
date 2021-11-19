import getDb from "../../../db/mongoose";
import { getSession } from "next-auth/react";
import mongoose from "mongoose";

async function comment(req, res) {
	const { resources, comments } = await getDb();
	const session = await getSession({ req });

	const newComment = await comments.create({
		content: req.body.content,
		author: session.user._id,
		timestamp: Date.now(),
	});

	await resources.updateOne(
		{ uri: req.body.uri },
		{
			$push: {
				comments: {
					$each: [newComment._id],
					$position: 0,
				},
			},
		}
	);

	return res.status(200).end();
}

export default comment;
