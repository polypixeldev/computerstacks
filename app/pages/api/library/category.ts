import { withSentry } from "@sentry/nextjs";

import libraryCategory from '../../../functions/libraryCategory';

import type { NextApiRequest, NextApiResponse } from 'next';

async function category(req: NextApiRequest, res: NextApiResponse) {
	if (typeof req.query.uri === 'object' || typeof req.query.uri === 'undefined') {
		throw new Error("Invalid category URI");
	}

	return res.json(await libraryCategory(req.query.uri));
}

export default withSentry(category);
