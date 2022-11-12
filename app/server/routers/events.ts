import { publicProcedure, router } from "../trpc";
import eventsFetch from '../../functions/eventsFetch';

export const eventsRouter = router({
	fetch: publicProcedure.query(async () => {
		return await eventsFetch();
	})
});