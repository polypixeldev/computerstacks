import getDb from "../../../db/mongoose";

async function fetch(req, res) {
	const { events } = await getDb();

	let data = await events.find({}, "name description uri date duration", {
		lean: true,
	});

	return res.json({
		events: data,
	});
}

export default fetch;
