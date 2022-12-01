import { ObjectId } from 'mongodb';

import mongoClient from '../../mongo-client';
import { publicProcedure } from '../../trpc';

const logout = publicProcedure
	.mutation(
		async ({ ctx: { bearer } }) => {
			mongoClient
				.db('squad')
				.collection('accounts')
				.updateOne(
					{ _id: new ObjectId(bearer?.userID) },
					{ $pull: { clients: { _id: new ObjectId(bearer?.clientID) } } },
				);

			return;
		},
	);

export default logout;
