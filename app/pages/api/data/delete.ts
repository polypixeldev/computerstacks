import { withSentry } from "@sentry/nextjs";
import { getSession } from 'next-auth/react';

import prisma from '../../../db/prisma';

import type { NextApiRequest, NextApiResponse } from 'next';

async function deleteData(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req });

	if (!session) return res.status(401).end();

	await prisma.user.delete({
		where: {
			id: session.user._id,
		},
	});

	res.status(200).end();
}

export default withSentry(deleteData);
