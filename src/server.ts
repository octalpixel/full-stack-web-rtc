import Fastify from 'fastify';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FastifyVite from '@fastify/vite';
import { join } from 'path';
import { renderToString } from 'react-dom/server';

const fastify = Fastify();

(async () => {
	await fastify.register(
		FastifyVite,
		{
			createRenderFunction({ createApp }: { createApp(): JSX.Element }) {
				return () => {
					return { element: renderToString(createApp()) };
				};
			},
			dev: process.argv.includes('--dev'),
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

	fastify.get(
		'/',
		(req, reply) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			reply.html(reply.render());
		},
	);

	const port = 6969;
	await fastify.listen({ port });
	console.log(`Fastify listening on port ${port}!`);
})();
