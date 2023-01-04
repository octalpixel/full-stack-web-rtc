import { ExtendedError } from 'socket.io/dist/namespace';
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

import { FastifyServer } from '../index.js';

export default function socketAuthentication(
	this: FastifyServer,
	socket: Socket,
	next: (err?: ExtendedError | undefined) => void,
) {
	const { handshake: { auth: { token } } } = socket;
	try {
		const {
			sub,
			userName,
		} = jwt.verify(
			token,
			this.config.JWT_ACCESS_SECRET,
		) as jwt.JwtPayload & {
			userName: string;
		};
		socket.data.userID = sub;
		socket.data.userName = userName;
		next();
	} catch (error) {
		next(error as Error);
	}
}
