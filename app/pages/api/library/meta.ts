import { withSentry } from "@sentry/nextjs";

import libraryMeta from '../../../functions/libraryMeta';

import type { NextApiRequest, NextApiResponse } from 'next';

async function meta(req: NextApiRequest, res: NextApiResponse) {
	return res.json(await libraryMeta());
}

export default withSentry(meta);
