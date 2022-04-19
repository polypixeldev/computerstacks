import { withSentry } from "@sentry/nextjs";

import roadmapsRoadmap from '../../../functions/roadmapsRoadmap';

import type { NextApiRequest, NextApiResponse } from 'next';

async function roadmap(req: NextApiRequest, res: NextApiResponse) {
	if (typeof req.query.uri === 'object') {
		throw new Error("Invalid roadmap URI");
	}

	return res.json(await roadmapsRoadmap(req.query.uri));
}

export default withSentry(roadmap);
