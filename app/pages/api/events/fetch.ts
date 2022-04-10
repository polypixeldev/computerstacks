import { withSentry } from "@sentry/nextjs";

import eventsFetch from '../../../functions/eventsFetch';

async function fetch(req, res) {
	return res.json(await eventsFetch());
}

export default withSentry(fetch);
