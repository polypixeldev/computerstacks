import librarySubcategory from '../../../functions/librarySubcategory';

async function subcategory(req, res) {
	return res.json(await librarySubcategory(req.query.uri));
}

export default subcategory;
