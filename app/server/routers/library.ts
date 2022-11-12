import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure, protectedProcedure, router } from "../trpc";
import prisma from '../../db/prisma';
import libraryCategory from '../../functions/libraryCategory';
import libraryMeta from '../../functions/libraryMeta';
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
			return await libraryMeta();
		}),
	resource: publicProcedure
		.input(z.object({
			uri: z.string()
		}))
		.query(async ({ input }) => {
			return await libraryResource(input.uri);
		}),
});