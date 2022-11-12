import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context'; 

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
	if (!ctx.session?.user?.email) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
		});
	}
	return next({
		ctx: {
			session: ctx.session,
		},
	});
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);