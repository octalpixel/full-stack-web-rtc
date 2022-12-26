import { Socket } from 'socket.io';

import { FastifyServer } from '../index.js';
import JoinConversationEventPayload from '../../types/socket-event-payloads/join-conversation.js';

function socketJoinConversationEventListener(
	this: {
		server: FastifyServer;
		socket: Socket;
	},
	{ participantIDs }: JoinConversationEventPayload,
) {
	// ensure only invited users can join the conversation
	if (participantIDs.includes(this.socket.data.userID)) {
		this.socket.join(participantIDs);
		this.socket.to(participantIDs).emit(
			'peer-joined',
			{
				peerName: this.socket.data.userName,
				socketID: this.socket.id,
			},
		);
		// (async () => {
		// 	const peers = await this.server.io.in(participantIDs).fetchSockets();
		// 	this.server.io.to(this.socket.id).emit(
		// 		'conversation-joined',
		// 		// let the newly connected socket know who else has already joined the conversation
		// 		peers
		// 			.filter(
		// 				(peer) => peer.id !== this.socket.id,
		// 			)
		// 			.map(
		// 				(peer) => ({
		// 					socketID: peer.id,
		// 					socketName: peer.data.userName,
		// 				}),
		// 			),
		// 	);
		// })();
	} else {
		this.socket._error(new Error('Access Denied.'));
	}
}

export default socketJoinConversationEventListener;
