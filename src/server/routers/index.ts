import { accountRouter } from './account/index.js';
import { router } from '../trpc.js';

export const appRouter = router({ account: accountRouter });

export type AppRouter = typeof appRouter;
