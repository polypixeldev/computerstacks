import { withSentry } from "@sentry/nextjs";

import roadmapsMeta from '../../../functions/roadmapsMeta';

import type { NextApiRequest, NextApiResponse } from 'next';

async function meta(req: NextApiRequest, res: NextApiResponse) {
	return res.json(await roadmapsMeta());
}

export default withSentry(meta);
