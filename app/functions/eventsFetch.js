import getDb from '../db/mongoose';

async function eventsFetch() {
	const { events } = await getDb();

	let data = await events.find({}, '-_id name description uri date duration', {
		lean: true,
	});

	data = data.map((event) => ({ ...event, date: event.date.toISOString() }));

	console.log(data);

	return {
		events: data,
	};
}

export default eventsFetch;
