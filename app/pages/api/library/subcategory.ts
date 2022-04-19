import { withSentry } from "@sentry/nextjs";

import librarySubcategory from '../../../functions/librarySubcategory';

import type { NextApiRequest, NextApiResponse } from 'next';

async function subcategory(req: NextApiRequest, res: NextApiResponse) {
	if (typeof req.query.uri === 'object') {
		throw new Error("Invalid subcategory URI");
	}

	return res.json(await librarySubcategory(req.query.uri));
}

export default withSentry(subcategory);
