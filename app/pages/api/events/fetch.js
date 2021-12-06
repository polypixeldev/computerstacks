import eventsFetch from '../../../functions/eventsFetch';

async function fetch(req, res) {
	return res.json(await eventsFetch());
}

export default fetch;
