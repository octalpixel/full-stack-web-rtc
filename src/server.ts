import Fastify from 'fastify';
import FastifyEnv from '@fastify/env';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FastifyVite from '@fastify/vite';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { join } from 'path';
import jwt from 'jsonwebtoken';
import { renderToString } from 'react-dom/server';
import socketioServer from 'fastify-socket.io';
import { stringify } from 'devalue';

import { appRouter } from './routers/index.js';
import { createContext } from './context.js';
import mongoClient from './mongo-client.js';

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

	fastify.io.use(
		(socket, next) => {
			const { handshake: { auth: { token } } } = socket;
			try {
				const {
					sub,
					userName,
				} = jwt.verify(
					token,
					process.env.JWT_ACCESS_SECRET as string,
				) as jwt.JwtPayload & {
					userName: string;
				};
				socket.data.userID = sub;
				socket.data.userName = userName;
				next();
			} catch (error) {
				next(error as Error);
			}
		},
	);

	fastify.io.on(
		'connection',
		(socket) => {
			socket.on(
				'answer',
				({
					participantIDs,
					sdp,
				}) => socket.to(participantIDs).emit(
					`${socket.id}-answer`,
					{ sdp },
				),
			);

			socket.on(
				'disconnecting',
				() => {
					socket.rooms.forEach(
						(room) => socket.to(room).emit(
							'peer-disconnected',
							{
								peer: {
									socketID: socket.id,
									socketName: socket.data.userName,
								},
							},
						),
					);
				},
			);

			socket.on(
				'ice-candidate',
				({
					participantIDs,
					candidate,
				}) => socket.to(participantIDs).emit(
					`${socket.id}-ice-candidate`,
					{ candidate },
				),
			);

			socket.on(
				'join-conversation',
				({ participantIDs }) => {
					// ensure only invited users can join the conversation
					if (participantIDs.includes(socket.data.userID)) {
						socket.join(participantIDs);
						socket.to(participantIDs).emit(
							'peer-joined',
							{
								peer: {
									socketID: socket.id,
									socketName: socket.data.userName,
								},
							},
						);
						(async () => {
							const peers = await fastify.io.in(participantIDs).fetchSockets();
							fastify.io.to(socket.id).emit(
								'conversation-joined',
								{
									// let the newly connected socket know who else has joined the conversation
									peers: peers.map((peer) => ({
										socketID: peer.id,
										socketName: peer.data.userName,
									})), 
								},
							);
						})();
					} else {
						socket._error(new Error('Access Denied.'));
					}
				},
			);

			socket.on(
				'offer',
				({
					participantIDs,
					sdp,
				}) => socket.to(participantIDs).emit(
					`${socket.id}-offer`,
					{ sdp },
				),
			);

			// socket.on(
			// 	'ping',
			// 	() => {
			// 		(async () => {
			// 			const sockets = await fastify.io.fetchSockets();
			// 			sockets.forEach(() => { /* do something */ });
			// 		})();
			// 	},
			// );
		},
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
			// createRenderFunction({ createApp }: { createApp(): JSX.Element }) {
			// 	return () => {
			// 		return { element: renderToString(createApp()) };
			// 	};
			// },
			dev: process.argv.includes('--dev'),
			renderer: {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				createRenderFunction({ createApp }) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					return function (server, req, reply) {
						const data = { wow: 'zow' };
						const app = createApp(
							{
								reply,
								req,
								server,
							},
							req.url,
						);
						const element = renderToString(app);
						return {
							element,
							hydration: `<script>window.hydration = ${stringify({ data })}</script>`,
						};
					};
				},
			},
			root: join(
				import.meta.url,
				'..',
				'..',
			),
		},
	);

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	await fastify.vite.ready();

	// fastify.get(
	// 	'/',
	// 	(req, reply) => {
	// 		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// 		// @ts-ignore
	// 		reply.html(reply.render());
	// 	},
	// );

	const port = 6969;
	await fastify.listen({ port });
	console.log(`Fastify listening on port ${port}!`);
})();
