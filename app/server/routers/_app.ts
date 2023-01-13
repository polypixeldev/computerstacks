import { z } from 'zod';

import prisma from '../../db/prisma';
import { router, publicProcedure } from '../trpc';
import { dataRouter } from './data';
import { eventsRouter } from './events';
import { libraryRouter } from './library';
import { roadmapsRouter } from './roadmaps';
import { userRouter } from './user';

export const appRouter = router({
	data: dataRouter,
	events: eventsRouter,
	library: libraryRouter,
	roadmaps: roadmapsRouter,
	user: userRouter,
	search: publicProcedure
		.input(
			z.object({
				query: z.string(),
			})
		)
		.query(async ({ input }) => {
			const categoryQuery = prisma.category.findMany({
				where: {
					OR: [
						{
							name: {
								search: input.query,
							},
						},
						{
							description: {
								search: input.query,
							},
						},
					],
				},
			});

			const resourceQuery = prisma.resource.findMany({
				where: {
					OR: [
						{
							name: {
								search: input.query,
							},
						},
						{
							description: {
								search: input.query,
							},
						},
						{
							author: {
								search: input.query,
							},
						},
					],
				},
			});

			const roadmapQuery = prisma.roadmap.findMany({
				where: {
					OR: [
						{
							name: {
								search: input.query,
							},
						},
						{
							description: {
								search: input.query,
							},
						},
					],
				},
			});

			const [category, resource, roadmap] = await Promise.all([
				categoryQuery,
				resourceQuery,
				roadmapQuery,
			]);

			return {
				category,
				resource,
				roadmap,
			};
		}),
});

export type AppRouter = typeof appRouter;
