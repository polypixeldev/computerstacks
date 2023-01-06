import { z } from 'zod';

import { protectedProcedure, router } from "../trpc";
import prisma from '../../db/prisma';

export const userRouter = router({
	favoriteCategory: protectedProcedure
		.input(
			z.object({
				uri: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			if (ctx.session.user.favoriteCategories.includes(input.uri)) {
				await prisma.user.update({
					where: {
						id: ctx.session.user.id
					},
					data: {
						favoriteCategories: {
							disconnect: { uri: input.uri }
						}
					}
				});
			} else {
				await prisma.user.update({
					where: {
						id: ctx.session.user.id
					},
					data: {
						favoriteCategories: {
							connect: { uri: input.uri }
						}
					}
				});
			}
		}),
	favoriteResource: protectedProcedure
		.input(
			z.object({
				uri: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			if (ctx.session.user.favoriteResources.includes(input.uri)) {
				await prisma.user.update({
					where: {
						id: ctx.session.user.id
					},
					data: {
						favoriteResources: {
							disconnect: { uri: input.uri }
						}
					}
				});
			} else {
				await prisma.user.update({
					where: {
						id: ctx.session.user.id
					},
					data: {
						favoriteResources: {
							connect: { uri: input.uri }
						}
					}
				});
			}
		}),
	roadmap: protectedProcedure
		.input(
			z.object({
				uri: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			if (ctx.session.user.roadmaps.includes(input.uri)) {
				await prisma.user.update({
					where: {
						id: ctx.session.user.id
					},
					data: {
						roadmaps: {
							disconnect: { uri: input.uri }
						}
					}
				});
			} else {
				await prisma.user.update({
					where: {
						id: ctx.session.user.id
					},
					data: {
						roadmaps: {
							connect: { uri: input.uri }
						}
					}
				});
			}
		})
});