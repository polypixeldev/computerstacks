import getDb from '../../../db/mongoose';
import { getSession } from 'next-auth/react';

async function roadmap(req, res) {
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

export default roadmap;
