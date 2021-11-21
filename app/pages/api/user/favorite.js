import { getSession } from 'next-auth/react';

import getDb from '../../../db/mongoose';

async function favorite(req, res) {
	const { user } = await getDb();

	const session = await getSession({ req });

	if (!session) return res.status(401).end();

	if (session.user.favorites.includes(req.body.uri)) {
		await user.updateOne(
			{ _id: session.user._id },
			{ $pull: { favorites: req.body.uri } }
		);
	} else {
		await user.updateOne(
			{ _id: session.user._id },
			{ $push: { favorites: req.body.uri } }
		);
	}

	return res.status(200).end();
}

export default favorite;
