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
import fastifyEnvOptions from './constants/fastify-env-options.js';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      JWT_ACCESS_SECRET: string,
      JWT_PASSWORD_RESET_SECRET: string,
      JWT_REFRESH_SECRET: string,
			PORT: number,
      SALT_ROUNDS: string,
      SENDGRID_API_KEY: string,
    };
  }
}

const fastify = Fastify();

(async () => {
	fastify.register(
		FastifyEnv,
		fastifyEnvOptions,
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
			socketConnectionEventListener.bind(fastify.io),
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

	await (fastify as typeof fastify & { vite: { ready(): Promise<void> } }).vite.ready();

	await fastify.listen({ port: fastify.config.PORT });
	console.log(`Fastify listening on port ${fastify.config.PORT}!`);
})();
