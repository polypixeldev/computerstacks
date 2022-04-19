import getDb from '../db/mongoose';

async function eventsFetch() {
	const { events } = await getDb();

	let data = await events.find({}, '-_id name description uri date duration', {
		lean: true,
	});

	return {
		events: data.map((event) => ({ ...event, date: event.date.toISOString() })),
	};
}

export default eventsFetch;
