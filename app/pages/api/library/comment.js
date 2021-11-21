import { getSession } from 'next-auth/react';

import getDb from '../../../db/mongoose';

async function comment(req, res) {
	const { resources, resourceComments } = await getDb();
	const session = await getSession({ req });

	const target = await resources.findOne({ uri: req.body.uri }, '_id');

	await resourceComments.create({
		content: req.body.content,
		author: session.user._id,
		parent: target._id,
		timestamp: Date.now(),
	});

	return res.status(200).end();
}

export default comment;
