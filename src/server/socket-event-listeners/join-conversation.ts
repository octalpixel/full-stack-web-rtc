import { Socket } from 'socket.io';

import { FastifyServer } from '../index.js';
import PeerInfoPayload from '../../types/socket-event-payloads/peer-info.js';

function socketJoinConversationEventListener(
	this: {
		server: FastifyServer;
		socket: Socket;
	},
	participantIDs: string,
) {
	// ensure only invited users can join the conversation
	if (participantIDs.includes(this.socket.data.userID)) {
		this.socket.join(participantIDs);
		this.socket.to(participantIDs).emit(
			'peer-joined',
			{
				name: this.socket.data.userName,
				socketID: this.socket.id,
			} as PeerInfoPayload,
		);
	} else {
		this.socket._error(new Error('Access Denied.'));
	}
}

export default socketJoinConversationEventListener;
