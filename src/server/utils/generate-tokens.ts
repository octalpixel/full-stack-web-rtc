import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { EnvironmentVariables } from '../constants/fastify-env-options';

interface GenerateTokensParams {
	clientID: string;
	config: EnvironmentVariables;
	userID: string;
	userName: string;
}

const generateTokens = async ({
	clientID,
	config,
	userName,
	userID,
}: GenerateTokensParams) => {
	const accessToken = jwt.sign(
		{
			clientID,
			userName,
		},
		config.JWT_ACCESS_SECRET,
		{
			// expires every 15 minutes
			expiresIn: 60 * 15,
			subject: userID,
		},
	);
	const refreshToken = jwt.sign(
		{ clientID },
		config.JWT_REFRESH_SECRET,
		{
			// expires roughly every 3 months
			expiresIn: 60 * 60 * 24 * 91,
			subject: userID,
		},
	);
	const hashedRefreshToken = await bcrypt.hash(
		// https://github.com/kelektiv/node.bcrypt.js/issues/935
		refreshToken.split('.')[2],
		config.SALT_ROUNDS,
	);
	return {
		accessToken,
		hashedRefreshToken,
		refreshToken,
	};
};

export default generateTokens;
