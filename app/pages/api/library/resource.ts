import { withSentry } from "@sentry/nextjs";

import libraryResource from '../../../functions/libraryResource';

import type { NextApiRequest, NextApiResponse } from 'next';

async function resource(req: NextApiRequest, res: NextApiResponse) {
	if (typeof req.query.uri === 'object') {
		throw new Error("Invalid resource URI");
	}

	return res.json(await libraryResource(req.query.uri));
}

export default withSentry(resource);
