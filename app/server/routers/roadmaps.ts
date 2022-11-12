import { z } from 'zod';

import { publicProcedure, protectedProcedure, router } from "../trpc";
import prisma from '../../db/prisma';
import roadmapsRoadmap from '../../functions/roadmapsRoadmap';

export const roadmapsRouter = router({
	comment: protectedProcedure
		.input(z.object({
			uri: z.string(),
			content: z.string()
		}))
		.mutation(async ({ ctx, input }) => {
			const target = await prisma.roadmap.findUnique({
				where: {
					uri: input.uri
				}
			});
		
			if (!target) {
				throw new Error("Invalid target document URI for commenting");
			}
		
			await prisma.roadmapComment.create({
				data: {
					content: input.content,
					author: {
						connect: { id: ctx.session.user.id }
					},
					parent: {
						connect: { uri: target.uri }
					},
					timestamp: Date()
				}
			});
		}),
	meta: publicProcedure
		.query(async () => {
			const roadmapCountQuery = prisma.roadmap.count();
			const roadmapsQuery = prisma.roadmap.findMany();
			const [numRoadmaps, roadmaps] = await Promise.all([roadmapCountQuery, roadmapsQuery]);
		
			return {
				numRoadmaps,
				roadmaps
			};
		}),
	roadmap: publicProcedure
		.input(z.object({
			uri: z.string()
		}))
		.query(async ({ input }) => {
			return await roadmapsRoadmap(input.uri);
		})
});