import { z } from 'zod';
import { Prisma } from '@prisma/client';

import { publicProcedure, protectedProcedure, router } from "../trpc";
import prisma from '../../db/prisma';
import libraryResource from '../../functions/libraryResource';

export const libraryRouter = router({
	category: publicProcedure
		.input(
			z.object({
				uri: z.string()
			})
		)
		.query(async ({ input }) => {
			const data = await prisma.category.findUnique({
				where: {
					uri: input.uri
				},
				include: {
					categoryChildren: true,
					resourceChildren: true,
					parent: true
				}
			});

			if (!data) {
				throw new Error(`Category URII ${input.uri} does not exist!`);
			}

			return data;
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
			const numResourcesQuery = prisma.resource.count();
			const numCategoriesQuery = prisma.category.count();
			const [numResources, numCategories] = await Promise.all([numResourcesQuery, numCategoriesQuery]);

			return {
				numResources,
				numCategories
			};
		}),
	allCategories: publicProcedure
		.query(async () => {
			const categoriesQuery = await prisma.category.findMany();

			return categoriesQuery;
		}),
	rootCategories: publicProcedure
		.query(async () => {
			const categoriesQuery = await prisma.category.findMany({
				where: {
					parentId: null
				}
			});

			return categoriesQuery;
		}),
	allResources: publicProcedure
		.query(async () => {
			const resourcesQuery = await prisma.resource.findMany();

			return resourcesQuery;
		}),
	getFullCategoryPath: publicProcedure
		.input(z.object({
			uri: z.string()
		}))
		.query(async ({ input }) => {
			let currentCategory = await prisma.category.findUnique({
				where: {
					uri: input.uri
				}
			});

			if (currentCategory === null) throw new Error(`Category URI ${input.uri} does not exist`);

			const path = [currentCategory.uri];

			while (currentCategory.parentId) {
				currentCategory = await prisma.category.findUnique({
					where: {
						uri: currentCategory.parentId
					}
				});

				if (!currentCategory) throw new Error(`Category URI ${input.uri} does not exist`);

				path.push(currentCategory.uri);
			}

			return path.reverse();
		}),
	resource: publicProcedure
		.input(z.object({
			uri: z.string()
		}))
		.query(async ({ input }) => {
			return await libraryResource(input.uri);
		}),
});