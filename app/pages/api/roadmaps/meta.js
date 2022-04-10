import { withSentry } from "@sentry/nextjs";

import roadmapsMeta from '../../../functions/roadmapsMeta';

async function meta(req, res) {
	return res.json(await roadmapsMeta());
}

export default withSentry(meta);
