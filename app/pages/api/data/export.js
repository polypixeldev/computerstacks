import prisma from "../../../db/prisma";
import { getSession } from "next-auth/react";

async function exportData(req, res) {
	const session = await getSession({ req });

	if (!session) return res.status(401).end();

	const data = await prisma.user.findUnique({
		where: {
			id: session.user._id,
		},
		select: {
			id: false,
			name: true,
			emailVerified: true,
			image: true,
			favorites: true,
			roadmaps: true,
		},
	});

	res.json(data);
}

export default exportData;
