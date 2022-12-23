import { JSONSchemaType } from 'env-schema';
import { fastifyEnvOpt } from '@fastify/env';

export interface EnvironmentVariables {
	JWT_ACCESS_SECRET: string;
	JWT_PASSWORD_RESET_SECRET: string;
	JWT_REFRESH_SECRET: string;
	PORT: number;
	SALT_ROUNDS: number;
	SENDGRID_API_KEY: string;
}

const fastifyEnvOptions: Omit<
	fastifyEnvOpt,
	'schema'
> & {
	schema: JSONSchemaType<EnvironmentVariables>;
} = {
	dotenv: true,
	schema: {
		properties: {
			JWT_ACCESS_SECRET: {
				default: 'abc',
				type: 'string',
			},
			JWT_PASSWORD_RESET_SECRET: {
				default: 'def',
				type: 'string',
			},
			JWT_REFRESH_SECRET: {
				default: 'hij',
				type: 'string',
			},
			PORT: {
				default: 6969,
				type: 'number',
			},
			SALT_ROUNDS: {
				default: 6,
				type: 'number',
			},
			SENDGRID_API_KEY: {
				default: 'SG.123',
				type: 'string',
			},
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
