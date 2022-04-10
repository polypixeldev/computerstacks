import { withSentry } from "@sentry/nextjs";

import roadmapsRoadmap from '../../../functions/roadmapsRoadmap';

async function roadmap(req, res) {
	return res.json(await roadmapsRoadmap(req.query.uri));
}

export default withSentry(roadmap);
