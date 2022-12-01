import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface GenerateTokensParams {
	clientID: string;
	userID: string;
	userName: string;
}

const generateTokens = async ({
	clientID,
	userName,
	userID,
}: GenerateTokensParams) => {
	const accessToken = jwt.sign(
		{
			clientID,
			userName,
		},
		process.env.JWT_ACCESS_SECRET as string,
		{
			// expires every 15 minutes
			expiresIn: 60 * 15,
			subject: userID,
		},
	);
	const refreshToken = jwt.sign(
		{ clientID },
		process.env.JWT_REFRESH_SECRET as string,
		{
			// expires roughly every 3 months
			expiresIn: 60 * 60 * 24 * 91,
			subject: userID,
		},
	);
	const hashedRefreshToken = await bcrypt.hash(
		// https://github.com/kelektiv/node.bcrypt.js/issues/935
		refreshToken.split('.')[2],
		parseInt(process.env.SALT_ROUNDS as string),
	);

	return {
		accessToken,
		hashedRefreshToken,
		refreshToken,
	};
};

export default generateTokens;
