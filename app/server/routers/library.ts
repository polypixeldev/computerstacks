import { z } from 'zod';

import { publicProcedure, protectedProcedure, router } from "../trpc";
import prisma from '../../db/prisma';
import libraryCategory from '../../functions/libraryCategory';
import libraryResource from '../../functions/libraryResource';

export const libraryRouter = router({
	category: publicProcedure
		.input(
			z.object({
				uri: z.string()
			})
		)
		.query(async ({ input }) => {
			return await libraryCategory(input.uri);
		}),
	comment: protectedProcedure
		.input(z.object({
			uri: z.string(),
			content: z.string()
		}))
		.mutation(async ({ ctx, input }) => {
			const target = await prisma.resource.findUnique({
				where: {
					uri: input.uri
				}
			});
		
			if (!target) {
				throw new Error("Invalid target document URI for commenting");
			}
		
			await prisma.resourceComment.create({
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
			const numResourcesQuery = prisma.resource.count()
			const numCategoriesQuery = prisma.category.count()
			const categoriesQuery = prisma.category.findMany()
			const [numResources, numCategories, categories] = await Promise.all([numResourcesQuery, numCategoriesQuery, categoriesQuery]);
		
			return {
				numResources,
				numCategories,
				categories
			};
		}),
	resource: publicProcedure
		.input(z.object({
			uri: z.string()
		}))
		.query(async ({ input }) => {
			return await libraryResource(input.uri);
		}),
});