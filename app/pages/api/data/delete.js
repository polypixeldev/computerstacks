import prisma from "../../../db/prisma";
import { getSession } from "next-auth/react";
import axios from "axios";

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

export default deleteData;
