import libraryResource from '../../../functions/libraryResource';

async function resource(req, res) {
	return res.json(await libraryResource(req.query.uri));
}

export default resource;
