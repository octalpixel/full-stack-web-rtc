import { fastifyEnvOpt } from '@fastify/env';

const fastifyEnvOptions: fastifyEnvOpt = {
	dotenv: true,
	schema: {
		properties: {
			JWT_ACCESS_SECRET: { type: 'string' },
			JWT_PASSWORD_RESET_SECRET: { type: 'string' },
			JWT_REFRESH_SECRET: { type: 'string' },
			PORT: { type: 'number' },
			SALT_ROUNDS: { type: 'string' },
			SENDGRID_API_KEY: { type: 'string' },
		},
		required: [
			'JWT_ACCESS_SECRET',
			'JWT_PASSWORD_RESET_SECRET',
			'JWT_REFRESH_SECRET',
			'PORT',
			'SALT_ROUNDS',
			'SENDGRID_API_KEY',
		],
		type: 'object',
	},
};

export default fastifyEnvOptions;
