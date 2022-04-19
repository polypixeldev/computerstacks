import { withSentry } from "@sentry/nextjs";
import { getSession } from 'next-auth/react';

import getDb from '../../../db/mongoose';

import type { NextApiRequest, NextApiResponse } from 'next';

async function roadmap(req: NextApiRequest, res: NextApiResponse) {
	const { user } = await getDb();

	const session = await getSession({ req });

	if (!session) return res.status(401).end();

	if (session.user.roadmaps.includes(req.body.uri)) {
		await user.updateOne(
			{ _id: session.user._id },
			{ $pull: { roadmaps: req.body.uri } }
		);
	} else {
		await user.updateOne(
			{ _id: session.user._id },
			{ $push: { roadmaps: req.body.uri } }
		);
	}

	return res.status(200).end();
}

export default withSentry(roadmap);
