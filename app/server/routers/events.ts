import { publicProcedure, router } from '../trpc';

export const eventsRouter = router({
	fetch: publicProcedure.query(async () => {
		const data = await prisma.event.findMany();

		return {
			events: data.map((event) => ({
				...event,
				date: event.date.toISOString(),
			})),
		};
	}),
});
