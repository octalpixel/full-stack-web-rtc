import { initTRPC } from '@trpc/server';

import { Context } from './context';

const {
	middleware,
	procedure: publicProcedure,
	router,
} = initTRPC.context<Context>().create();

export {
	middleware,
	publicProcedure,
	router,
};
