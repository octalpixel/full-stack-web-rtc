import { ObjectId } from 'mongodb';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';

import generateTokens from '../../utils/generate-tokens.js';
import mongoClient from '../../mongo-client.js';
import { publicProcedure } from '../../trpc.js';

const login = publicProcedure
	.input(
		z.object({
			email: z.string(),
			password: z.string(),
		}),
	)
	.mutation(
		async ({
			input: {
				email,
				password,
			},
		}) => {
			const accounts = await mongoClient
				.db('squad')
				.collection('accounts')
				.aggregate([
					{ $match: { email } },
					{
						$project: {
							name: '$name',
							password: '$password',
						},
					},
				])
				.toArray();

			if (!accounts.length) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Account not found!',
				});
			}

			const passwordIsCorrect = await bcrypt.compare(
				password,
				accounts[0].password,
			);

			if (!passwordIsCorrect) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Account not found!',
				});
			}

			const clientID = new ObjectId();
			const {
				accessToken,
				hashedRefreshToken,
				refreshToken,
			} = await generateTokens({
				clientID: clientID.toHexString(),
				userID: accounts[0]._id.toHexString(),
				userName: accounts[0].name,
			});

			const result = await mongoClient
				.db('squad')
				.collection('accounts')
				.updateOne(
					{ email },
					{
						$push: {
							clients: {
								_id: clientID,
								tokens: [hashedRefreshToken],
							},
						},
					},
				);

			if (result.acknowledged) {
				return {
					accessToken,
					refreshToken,
					userID: accounts[0]._id.toHexString() as string,
					userName: accounts[0].name as string,
				};
			}

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Login failed!',
			});
		},
	);

export default login;
