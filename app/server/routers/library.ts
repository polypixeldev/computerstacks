import { z } from 'zod';

import {
	publicProcedure,
	protectedProcedure,
	adminProcedure,
	router,
} from '../trpc';
import prisma from '../../db/prisma';

export const libraryRouter = router({
	category: publicProcedure
		.input(
			z.object({
				uri: z.string(),
			})
		)
		.query(async ({ input }) => {
			const data = await prisma.category.findUnique({
				where: {
					uri: input.uri,
				},
				include: {
					categoryChildren: true,
					resourceChildren: true,
					parent: true,
				},
			});

			if (!data) {
				return null;
			}

			return data;
		}),
	comment: protectedProcedure
		.input(
			z.object({
				uri: z.string(),
				content: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const target = await prisma.resource.findUnique({
				where: {
					uri: input.uri,
				},
			});

			if (!target) {
				throw new Error('Invalid target document URI for commenting');
			}

			await prisma.resourceComment.create({
				data: {
					content: input.content,
					author: {
						connect: { id: ctx.session.user.id },
					},
					parent: {
						connect: { uri: target.uri },
					},
					timestamp: new Date(),
				},
			});
		}),
	meta: publicProcedure.query(async () => {
		const numResourcesQuery = prisma.resource.count();
		const numCategoriesQuery = prisma.category.count();
		const [numResources, numCategories] = await Promise.all([
			numResourcesQuery,
			numCategoriesQuery,
		]);

		return {
			numResources,
			numCategories,
		};
	}),
	allCategories: publicProcedure.query(async () => {
		const categoriesQuery = await prisma.category.findMany();

		return categoriesQuery;
	}),
	rootCategories: publicProcedure.query(async () => {
		const categoriesQuery = await prisma.category.findMany({
			where: {
				parentId: null,
			},
		});

		return categoriesQuery;
	}),
	allResources: publicProcedure.query(async () => {
		const resourcesQuery = await prisma.resource.findMany();

		return resourcesQuery;
	}),
	getFullCategoryPath: publicProcedure
		.input(
			z.object({
				uri: z.string(),
			})
		)
		.query(async ({ input }) => {
			let currentCategory = await prisma.category.findUnique({
				where: {
					uri: input.uri,
				},
			});

			if (currentCategory === null)
				throw new Error(`Category URI ${input.uri} does not exist`);

			const path = [currentCategory.uri];

			while (currentCategory.parentId) {
				currentCategory = await prisma.category.findUnique({
					where: {
						uri: currentCategory.parentId,
					},
				});

				if (!currentCategory)
					throw new Error(`Category URI ${input.uri} does not exist`);

				path.push(currentCategory.uri);
			}

			return path.reverse();
		}),
	resource: publicProcedure
		.input(
			z.object({
				uri: z.string(),
			})
		)
		.query(async ({ input }) => {
			const data = await prisma.resource.findUnique({
				where: {
					uri: input.uri,
				},
			});

			return data;
		}),
	isCategory: publicProcedure
		.input(
			z.object({
				uri: z.string(),
			})
		)
		.query(async ({ input }) => {
			const categoryUri = await prisma.category.findUnique({
				where: {
					uri: input.uri,
				},
				select: {
					uri: true,
				},
			});

			return categoryUri !== null;
		}),
	resourceComments: publicProcedure
		.input(
			z.object({
				uri: z.string(),
			})
		)
		.query(async ({ input }) => {
			const data = await prisma.resource.findUnique({
				where: {
					uri: input.uri,
				},
				include: {
					comments: {
						include: {
							author: true,
						},
					},
				},
			});

			if (!data) {
				throw new Error(`Resource URI ${input.uri} does not exist`);
			}

			data.comments.reverse();

			return data.comments;
		}),
	addCategory: adminProcedure
		.input(
			z.object({
				name: z.string(),
				uri: z.string(),
				description: z.string(),
				parentUri: z.string().optional(),
				level: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			const parentCategory = input.parentUri
				? await prisma.category.findUnique({
						where: {
							uri: input.parentUri,
						},
				  })
				: null;

			if (parentCategory === null && input.parentUri !== undefined)
				throw new Error(`Invalid parent category URI ${input.parentUri}`);

			await prisma.category.create({
				data: {
					name: input.name,
					uri: input.uri,
					description: input.description,
					parentId: input.parentUri,
					level: input.level,
				},
			});
		}),
	updateCategory: adminProcedure
		.input(
			z.object({
				name: z.string(),
				uri: z.string(),
				description: z.string(),
				level: z.number(),
			})
		)
		.mutation(async ({ input }) => {
			await prisma.category.update({
				where: {
					uri: input.uri,
				},
				data: {
					name: input.name,
					description: input.description,
					level: input.level,
				},
			});
		}),
	addResource: adminProcedure
		.input(
			z.object({
				name: z.string(),
				uri: z.string(),
				description: z.string(),
				parentUri: z.string(),
				level: z.number(),
				link: z.string(),
				author: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			const parentCategory = input.parentUri
				? await prisma.category.findUnique({
						where: {
							uri: input.parentUri,
						},
				  })
				: null;

			if (parentCategory === null && input.parentUri !== undefined)
				throw new Error(`Invalid parent category URI ${input.parentUri}`);

			await prisma.resource.create({
				data: {
					name: input.name,
					uri: input.uri,
					description: input.description,
					parentId: input.parentUri,
					level: input.level,
					author: input.author,
					link: input.link,
					timestamp: new Date(),
				},
			});
		}),
	updateResource: adminProcedure
		.input(
			z.object({
				name: z.string(),
				uri: z.string(),
				description: z.string(),
				level: z.number(),
				link: z.string(),
				author: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			await prisma.resource.update({
				where: {
					uri: input.uri,
				},
				data: {
					name: input.name,
					description: input.description,
					level: input.level,
					author: input.author,
					link: input.link,
				},
			});
		}),
});
