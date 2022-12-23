import { ObjectId } from 'mongodb';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import mongoClient from '../../constants/mongo-client.js';
import { publicProcedure } from '../../trpc.js';

const subscribeToPushNotifications = publicProcedure
	.input(
		z.object({
			push_subscription: z.object({
				endpoint: z.string(),
				keys: z.object({
					auth: z.string(),
					p256dh: z.string(),
				}),
			}),
		}),
	)
	.mutation(
		async ({
			ctx: { bearer },
			input: { push_subscription },
		}) => {
			if (!bearer) throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Please login.',
			});

			const result = await mongoClient
				.db('squad')
				.collection('accounts')
				.updateOne(
					{
						_id: new ObjectId(bearer.userID),
						clients: { $elemMatch: { _id: new ObjectId(bearer.clientID) } },
					},
					{ $set: { 'clients.$.push_subscription': push_subscription } },
				);

			if (result.modifiedCount) return;

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Subscribe to push notifications failed!',
			});
		},
	);

export default subscribeToPushNotifications;
