import libraryMeta from '../../../functions/libraryMeta';

async function meta(req, res) {
	return res.json(await libraryMeta());
}

export default meta;
