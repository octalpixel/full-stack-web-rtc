import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import mongoClient from '../../mongo-client.js';
import { publicProcedure } from '../../trpc.js';
import sgMail from '../../sendgrid-mail.js';

const requestPasswordReset = publicProcedure
	.input(z.object({ email: z.string() }))
	.mutation(
		async ({ input: { email } }) => {
			const account = await mongoClient
				.db('squad')
				.collection('accounts')
				.findOne({ email });

			if (!account) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Account not found!',
				});
			}

			const reset_token = jwt.sign(
				{
					email,
					userName: account.name,
				},
				process.env.JWT_PASSWORD_RESET_SECRET as string,
				{
					expiresIn: 60 * 15,
					subject: account._id.toHexString(),
				},
			);

			const result = await mongoClient
				.db('squad')
				.collection('accounts')
				.updateOne(
					{ email },
					{ $set: { reset_token } },
				);

			if (result.modifiedCount) {
				sgMail.send({
					from: 'admin@squad.com',
					html: `<a href="http://localhost:6969/password-reset/${reset_token}">Click this link to reset your Squad password</a>`,
					subject: 'Squad Password Reset',
					to: email,
				});
				return;
			}

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Request password reset failed!',
			});
		},
	);

export default requestPasswordReset;
