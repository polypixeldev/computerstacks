import { withSentry } from "@sentry/nextjs";
import { getSession } from 'next-auth/react';

import prisma from '../../../db/prisma';

async function deleteData(req, res) {
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
