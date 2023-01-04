import Fastify, {
	FastifyReply,
	FastifyRequest,
} from 'fastify';
import FastifyEnv from '@fastify/env';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FastifyVite from '@fastify/vite';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { join } from 'path';
import { renderToString } from 'react-dom/server';
import socketioServer from 'fastify-socket.io';
// import { stringify } from 'devalue';

import clientModule, { ClientModule } from '../client/index.js';
import fastifyEnvOptions, { EnvironmentVariables } from './constants/fastify-env-options.js';
import { CreateApp } from '../client/base.js';
import { appRouter } from './routers/index.js';
import { createContext } from './context.js';
import mongoClient from './constants/mongo-client.js';
import socketAuthentication from './middleware/socket-authentication.js';
import socketConnectionEventListener from './socket-event-listeners/connection.js';

declare module 'fastify' {
	interface FastifyInstance {
		config: EnvironmentVariables;
	}
}

const fastify = Fastify();
export type FastifyServer = typeof fastify;

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
		.use(socketAuthentication.bind(fastify));

	fastify
		.io
		.on(
			'connection',
			socketConnectionEventListener.bind(fastify),
		);

	fastify.register(
		fastifyTRPCPlugin,
		{
			prefix: '/trpc',
			trpcOptions: {
				createContext: createContext.bind(fastify),
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

	await fastify.listen({
		host: '0.0.0.0',
		port: fastify.config.APP_PORT,
	});
	console.log(`Fastify listening on port ${fastify.config.APP_PORT}!`);
})();
