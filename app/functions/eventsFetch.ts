import prisma from '../db/prisma';

async function eventsFetch() {
	const data = await prisma.event.findMany();

	return {
		events: data.map((event) => ({ ...event, date: event.date.toISOString() })),
	};
}

export default eventsFetch;
