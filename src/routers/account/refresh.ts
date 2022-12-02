import { ObjectId } from 'mongodb';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import generateTokens from '../../utils/generate-tokens.js';
import mongoClient from '../../mongo-client.js';
import { publicProcedure } from '../../trpc.js';

const refresh = publicProcedure
	.input(z.string())
	.mutation(
		async ({ input }) => {
			const decodedToken = jwt.verify(
				input,
				process.env.JWT_REFRESH_SECRET as string,
			);

			if (typeof decodedToken === 'string') {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Decoded token should be a JwtPayload, not a string.',
				});
			}

			if (!decodedToken.sub) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'No account ID provided!',
				});
			}

			if (!decodedToken.clientID) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'No clientID provided!',
				});
			}

			const accounts = await mongoClient
				.db('squad')
				.collection('accounts')
				.aggregate([
					{ $match: { _id: new ObjectId(decodedToken.sub) } },
					{
						$project: {
							clients: '$clients',
							name: '$name',
						},
					},
				])
				.toArray();
		
			if (!accounts.length) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Account not found!',
				});
			}

			const client = accounts[0]
				.clients
				.find(
					({ _id }: { _id: ObjectId }) => _id.toHexString() === decodedToken.clientID,
				);

			if (!client) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Client not found!',
				});
			}

			const resetTokenIsValid = await bcrypt.compare(
				input.split('.')[2],
				client.tokens[client.tokens.length - 1],
			);

			if (!resetTokenIsValid) {
				// incorrect or expired token; remove the client as a security precaution
				mongoClient
					.db('squad')
					.collection('accounts')
					.updateOne(
						{ _id: accounts[0]._id },
						{ $pull: { clients: { _id: client._id } } },
					);
			
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Invalid reset token!',
				});
			}

			const {
				accessToken,
				hashedRefreshToken,
				refreshToken,
			} = await generateTokens({
				clientID: decodedToken.clientID,
				userID: decodedToken.sub,
				userName: accounts[0].name,
			});

			const result = await mongoClient
				.db('squad')
				.collection('accounts')
				.updateOne(
					{
						_id: accounts[0]._id,
						clients: { $elemMatch: { _id: client._id } },
					},
					{ $push: { 'clients.$.tokens': hashedRefreshToken } },
				);

			if (result.acknowledged) {
				return {
					accessToken,
					refreshToken,
					userID: decodedToken.sub,
					userName: accounts[0].name,
				};
			}

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Refresh failed!',
			});
		},
	);

export default refresh;
