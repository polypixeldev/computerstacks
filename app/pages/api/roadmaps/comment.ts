import { withSentry } from "@sentry/nextjs";
import { getSession } from 'next-auth/react';

import getDb from '../../../db/mongoose';

import type { NextApiRequest, NextApiResponse } from 'next';

async function comment(req: NextApiRequest, res: NextApiResponse) {
	const { roadmaps, roadmapComments } = await getDb();
	const session = await getSession({ req });

	if (!session) {
		throw new Error("Unable to fetch user session for commenting");
	}

	const target = await roadmaps.findOne({ uri: req.body.uri }, '_id');

	if (!target) {
		throw new Error("Invalid target document URI for commenting");
	}

	await roadmapComments.create({
		content: req.body.content,
		author: session.user._id,
		parent: target._id,
		timestamp: Date.now(),
	});

	return res.status(200).end();
}

export default withSentry(comment);
