import { withSentry } from "@sentry/nextjs";
import { getSession } from 'next-auth/react';

import getDb from '../../../db/mongoose';

import type { NextApiRequest, NextApiResponse } from 'next';

async function comment(req: NextApiRequest, res: NextApiResponse) {
	const { resources, resourceComments } = await getDb();
	const session = await getSession({ req });

	if (!session) {
		throw new Error("Unable to fetch user session for commenting");
	}

	const target = await resources.findOne({ uri: req.body.uri }, '_id');

	if (!target) {
		throw new Error("Invalid target document URI for commenting");
	}

	await resourceComments.create({
		content: req.body.content,
		author: session.user._id,
		parent: target._id,
		timestamp: Date.now(),
	});

	return res.status(200).end();
}

export default withSentry(comment);
