import { ObjectId } from 'mongodb';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import mongoClient from '../../mongo-client.js';
import { publicProcedure } from '../../trpc.js';

const editAccount = publicProcedure
	.input(z.object({ name: z.optional(z.string()) }))
	.mutation(
		async ({
			ctx: { bearer },
			input,
		}) => {
			if (!bearer) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Please login.',
				});
			}

			const result = await mongoClient
				.db('squad')
				.collection('accounts')
				.updateOne(
					{ _id: new ObjectId(bearer.userID) },
					{ $set: input },
				);

			if (result.modifiedCount) return;

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Edit account failed!',
			});
		},
	);

export default editAccount;
