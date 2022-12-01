import { TRPCError } from '@trpc/server';
import { ProcedureResolver } from '@trpc/server/dist/declarations/src/internals/procedure';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { IAccount } from 'mongodb-server';
import { z } from 'zod';

import { Context } from '../../context';
import mongoClient from '../../mongo-client';
import generateTokens from '../../utils/generate-tokens';
import getRandomScryfallCards from '../../utils/get-random-scryfall-cards';

export const registerInput = z.object({
  email: z.string(),
  name: z.string(),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof registerInput>;

export interface RegisterDocument extends Pick<IAccount, 'avatar' | 'email' | 'name'> {
  _id: string;
  accessToken: string;
  refreshToken: string;
};

const register: ProcedureResolver<
  Context,
  RegisterInput,
  RegisterDocument
> = async ({
  ctx,
  input: {
    email,
    name,
    password,
  },
}) => {
  try {
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS as string),
    );
    const avatar = (await getRandomScryfallCards(1))[0];
    const accountID = new ObjectId();
    const clientID = new ObjectId();
    const {
      accessToken,
      hashedRefreshToken,
      refreshToken,
    } = await generateTokens(
      false,
      clientID.toHexString(),
      accountID.toHexString(),
    );

    const result = await mongoClient
      .db('clm')
      .collection<IAccount>('accounts')
      .insertOne({
        _id: accountID,
        admin: false,
        aspiring_buds: [],
        avatar: avatar._id,
        buds: [],
        clients: [{
          _id: clientID,
          tokens: [hashedRefreshToken],
        }],
        desired_buds: [],
        email,
        name,
        password: hashedPassword
      });

    if (result.acknowledged) {
      return {
        _id: accountID.toHexString(),
        accessToken,
        avatar: avatar.image_uris?.art_crop ?? avatar.card_faces!.at(0)!.image_uris?.art_crop!,
        email,
        name,
        refreshToken,
      };
    }

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Register failed!',
    });
  } catch (error) {
    throw error;
  }
};

export default register;
