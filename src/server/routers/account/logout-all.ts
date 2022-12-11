import { ObjectId } from 'mongodb';

import mongoClient from '../../mongo-client.js';
import { publicProcedure } from '../../trpc.js';

const logoutAll = publicProcedure
	.mutation(
		async ({ ctx: { bearer } }) => {
			mongoClient
				.db('squad')
				.collection('accounts')
				.updateOne(
					{ _id: new ObjectId(bearer?.userID) },
					{ $set: { clients: [] } },
				);

			return;
		},
	);

export default logoutAll;
