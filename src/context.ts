import jwt, { JwtPayload } from 'jsonwebtoken';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { inferAsyncReturnType } from '@trpc/server';

export function createContext({
	req,
	res, 
}: CreateFastifyContextOptions) {
	console.log(req.headers);
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
					process.env.JWT_ACCESS_SECRET as string,
				) as JwtPayload & { clientID: string };

				return {
					bearer: {
						clientID: decodedToken.clientID,
						userID: decodedToken.sub,
					},
					req,
					res,
				};
			} catch (error) {
				return {
					bearer: null,
					req,
					res,
				};
			}
		}
	}
	return {
		bearer: null,
		req,
		res,
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
