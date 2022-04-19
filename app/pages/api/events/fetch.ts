import { withSentry } from "@sentry/nextjs";

import eventsFetch from '../../../functions/eventsFetch';

import type { NextApiRequest, NextApiResponse } from 'next';

async function fetch(req: NextApiRequest, res: NextApiResponse) {
	return res.json(await eventsFetch());
}

export default withSentry(fetch);
