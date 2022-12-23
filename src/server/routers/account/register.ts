import { ObjectId } from 'mongodb';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';

import generateTokens from '../../utils/generate-tokens.js';
import mongoClient from '../../constants/mongo-client.js';
import { publicProcedure } from '../../trpc.js';

const register = publicProcedure
	.input(
		z.object({
			email: z.string(),
			name: z.string(),
			password: z.string(),
		}),
	)
	.mutation(
		async ({
			input: {
				email,
				name,
				password,
			},
		}) => {
			const hashedPassword = await bcrypt.hash(
				password,
				parseInt(process.env.SALT_ROUNDS as string),
			);
			const userID = new ObjectId();
			const clientID = new ObjectId();
			const {
				accessToken,
				hashedRefreshToken,
				refreshToken,
			} = await generateTokens({
				clientID: clientID.toHexString(),
				userID: userID.toHexString(),
				userName: name,
			});

			const result = await mongoClient
				.db('squad')
				.collection('accounts')
				.insertOne({
					_id: userID,
					clients: [
						{
							_id: clientID,
							tokens: [hashedRefreshToken],
						},
					],
					email,
					name,
					password: hashedPassword,
				});

			if (result.acknowledged) {
				return {
					accessToken,
					refreshToken,
					userID: userID.toHexString(),
					userName: name,
				};
			}

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Register failed!',
			});
		},
	);

export default register;
