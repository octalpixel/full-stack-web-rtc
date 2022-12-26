import { JSONSchemaType } from 'env-schema';
import { fastifyEnvOpt } from '@fastify/env';

export interface EnvironmentVariables {
	APP_PORT: number;
	DB_HOST: string;
	DB_PORT: number;
	JWT_ACCESS_SECRET: string;
	JWT_PASSWORD_RESET_SECRET: string;
	JWT_REFRESH_SECRET: string;
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
			APP_PORT: {
				default: 6969,
				type: 'number',
			},
			DB_HOST: {
				default: '127.0.0.1',
				type: 'string',
			},
			DB_PORT: {
				default: 27017,
				type: 'number',
			},
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
			'APP_PORT',
			'DB_HOST',
			'DB_PORT',
			'JWT_ACCESS_SECRET',
			'JWT_PASSWORD_RESET_SECRET',
			'JWT_REFRESH_SECRET',
			'SALT_ROUNDS',
			'SENDGRID_API_KEY',
		],
		type: 'object',
	},
};

export default fastifyEnvOptions;
