import { withSentry } from "@sentry/nextjs";

import libraryCategory from '../../../functions/libraryCategory';

async function category(req, res) {
	return res.json(await libraryCategory(req.query.uri));
}

export default withSentry(category);
