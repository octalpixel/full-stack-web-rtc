import Fastify, {
	FastifyReply,
	FastifyRequest,
} from 'fastify';
import FastifyEnv from '@fastify/env';
// @ts-ignore
import FastifyVite from '@fastify/vite';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { join } from 'path';
import { renderToString } from 'react-dom/server';
import socketioServer from 'fastify-socket.io';
// import { stringify } from 'devalue';

import clientModule, { ClientModule } from '../client/index.js';
import { CreateApp } from '../client/base.js';
import { appRouter } from './routers/index.js';
import { createContext } from './context.js';
import mongoClient from './mongo-client.js';
import socketAuthentication from './middleware/socket-authentication.js';
import socketConnectionEventListener from './socket-event-listeners/connection.js';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      JWT_ACCESS_SECRET: string,
      JWT_PASSWORD_RESET_SECRET: string,
      JWT_REFRESH_SECRET: string,
      SALT_ROUNDS: string,
      SENDGRID_API_KEY: string,
    };
  }
}

const fastify = Fastify();

const envOptions = {
	// confKey: 'config',
	// data: process.env,
	dotenv: true,
	schema: {
		properties: {
			JWT_ACCESS_SECRET: { type: 'string' },
			JWT_PASSWORD_RESET_SECRET: { type: 'string' },
			JWT_REFRESH_SECRET: { type: 'string' },
			SALT_ROUNDS: { type: 'string' },
			SENDGRID_API_KEY: { type: 'string' },
		},
		required: [
			'JWT_ACCESS_SECRET',
			'JWT_PASSWORD_RESET_SECRET',
			'JWT_REFRESH_SECRET',
			'SALT_ROUNDS',
			'SENDGRID_API_KEY',
		],
		type: 'object',
	},
};

(async () => {
	fastify.register(
		FastifyEnv,
		envOptions,
	);
	await fastify.after();
	await mongoClient.connect();
	await fastify.register(socketioServer);

	fastify
		.io
		.use(socketAuthentication);

	fastify
		.io
		.on(
			'connection',
			socketConnectionEventListener,
		);

	fastify.register(
		fastifyTRPCPlugin,
		{
			prefix: '/trpc',
			trpcOptions: {
				createContext,
				router: appRouter,
			},
		},
	);

	await fastify.register(
		FastifyVite,
		{
			// dev: process.argv.includes('--dev'),
			renderer: {
				createRenderFunction({ createApp }: { createApp: CreateApp }) {
					return function (
						clientModule: ClientModule,
						req: FastifyRequest,
						reply: FastifyReply,
					) {
						return {
							element: renderToString(
								createApp(
									{
										reply,
										req,
										server: clientModule,
									},
									req.url,
								),
							),
							// hydration: `<script>window.hydration = ${
							// 	stringify({
							// 		data: {
							//			foo: bar
							//		}
							// 	})
							// }</script>`,
						};
					};
				},
				prepareClient() {
					return clientModule;
				},
			},
			root: join(
				import.meta.url,
				'..',
				'..',
				'..',
			),
		},
	);

	// @ts-ignore
	await fastify.vite.ready();

	const port = 6969;
	await fastify.listen({ port });
	console.log(`Fastify listening on port ${port}!`);
})();
