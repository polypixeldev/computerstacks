import { withSentry } from "@sentry/nextjs";
import { getSession } from 'next-auth/react';

import prisma from '../../../db/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

async function comment(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req });

	if (!session) {
		throw new Error("Unable to fetch user session for commenting");
	}

	const target = await prisma.roadmap.findUnique({
		where: {
			uri: req.body.uri
		}
	});

	if (!target) {
		throw new Error("Invalid target document URI for commenting");
	}

	await prisma.roadmapComment.create({
		data: {
			content: req.body.content,
			author: {
				connect: { id: session.user.id }
			},
			parent: {
				connect: { uri: target.uri }
			},
			timestamp: Date()
		}
	});

	return res.status(200).end();
}

export default withSentry(comment);
