import getDb from '../../../db/mongoose';
import { getSession } from 'next-auth/react';

async function comment(req, res) {
	const { roadmaps, roadmapComments } = await getDb();
	const session = await getSession({ req });

	const target = await roadmaps.findOne({ uri: req.body.uri }, '_id');

	await roadmapComments.create({
		content: req.body.content,
		author: session.user._id,
		parent: target._id,
		timestamp: Date.now(),
	});

	return res.status(200).end();
}

export default comment;
