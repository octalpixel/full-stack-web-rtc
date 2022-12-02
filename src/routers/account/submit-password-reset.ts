import { ObjectId } from 'mongodb';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import generateTokens from '../../utils/generate-tokens.js';
import mongoClient from '../../mongo-client.js';
import { publicProcedure } from '../../trpc.js';

const submitPasswordReset = publicProcedure
	.input(
		z.object({
			password: z.string(),
			reset_token: z.string(),
		}),
	)
	.mutation(
		async ({
			input: {
				password,
				reset_token,
			},
		}) => {
			const {
				sub,
				email,
				userName,
			} = jwt.verify(
				reset_token,
			process.env.JWT_PASSWORD_RESET_SECRET as string,
			) as jwt.JwtPayload & {
				email: string;
				userName: string;
			};
			const hashedPassword = await bcrypt.hash(
				password,
				parseInt(process.env.SALT_ROUNDS as string),
			);
			const clientID = new ObjectId();
			const {
				accessToken,
				hashedRefreshToken,
				refreshToken,
			} = await generateTokens({
				clientID: clientID.toHexString(),
				userID: sub as string,
				userName,
			});
			const result = await mongoClient
				.db('squad')
				.collection('accounts')
				.updateOne(
					{
						email,
						reset_token,
					},
					{
						$set: {
							clients: [
								{
									_id: clientID,
									tokens: [hashedRefreshToken],
								},
							],
							password: hashedPassword,
						},
						$unset: { reset_token: '' },
					},
				);

			if (result.modifiedCount) {
				return {
					accessToken,
					refreshToken,
					userID: sub,
					userName,
				};
			}

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Password reset failed!',
			});
		},
	);

export default submitPasswordReset;
