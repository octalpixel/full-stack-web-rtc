import { ObjectId } from 'mongodb';
import { TRPCError } from '@trpc/server';

import mongoClient from '../../mongo-client.js';
import { publicProcedure } from '../../trpc.js';

const unsubscribeFromPushNotifications = publicProcedure
	.mutation(
		async ({ ctx: { bearer } }) => {
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
					{ $unset: { 'clients.$.push_subscription': '' } },
				);

			if (result.modifiedCount) return;

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Unsubscribe from push notifications failed!',
			});
		},
	);

export default unsubscribeFromPushNotifications;
