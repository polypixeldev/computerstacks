import { protectedProcedure, router } from "../trpc";
import prisma from '../../db/prisma';

export const dataRouter = router({
	delete: protectedProcedure.mutation(async ({ ctx }) => {
		await prisma.user.delete({
			where: {
				id: ctx.session.user.id,
			},
		});
	}),
	export: protectedProcedure.query(async ({ ctx }) => {
		const data = await prisma.user.findUnique({
			where: {
				id: ctx.session.user.id,
			},
			select: {
				id: false,
				name: true,
				emailVerified: true,
				image: true,
				favoriteCategories: true,
				favoriteResources: true,
				roadmaps: true,
			},
		});

		return data;
	})
});