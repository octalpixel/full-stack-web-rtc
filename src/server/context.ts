import jwt, { JwtPayload } from 'jsonwebtoken';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { inferAsyncReturnType } from '@trpc/server';

import { FastifyServer } from './index.js';

export function createContext(
	this: FastifyServer,
	{
		req,
		res,
	}: CreateFastifyContextOptions,
) {
	if ('authorization' in req.headers) {
		const token = req
			.headers
			.authorization
			?.replace(
				'Bearer ',
				'',
			);

		if (token) {
			try {
				const decodedToken = jwt.verify(
					token,
					this.config.JWT_ACCESS_SECRET,
				) as JwtPayload & { clientID: string };

				return {
					bearer: {
						clientID: decodedToken.clientID,
						userID: decodedToken.sub,
					},
					config: this.config,
					req,
					res,
				};
			} catch (error) {
				return {
					bearer: null,
					config: this.config,
					req,
					res,
				};
			}
		}
	}
	return {
		bearer: null,
		config: this.config,
		req,
		res,
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
