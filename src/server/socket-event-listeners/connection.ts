import {
	Server,
	Socket,
} from 'socket.io';

import socketAnswerEventListener from './answer.js';
import socketDisconnectingEventListener from './disconnecting.js';
import socketICECandidateEventListener from './ice-candidate.js';
import socketOfferEventListener from './offer.js';

function socketConnectionEventListener(this: Server, socket: Socket) {
	socket.on(
		'answer',
		socketAnswerEventListener.bind(socket),
	);

	socket.on(
		'disconnecting',
		socketDisconnectingEventListener.bind(socket),
	);

	socket.on(
		'ice-candidate',
		socketICECandidateEventListener.bind(socket),
	);

	socket.on(
		'join-conversation',
		({ participantIDs }) => {
			// TODO: can you go up the "this" chain in JS?
			// ensure only invited users can join the conversation
			if (participantIDs.includes(socket.data.userID)) {
				socket.join(participantIDs);
				socket.to(participantIDs).emit(
					'peer-joined',
					{
						peer: {
							socketID: socket.id,
							socketName: socket.data.userName,
						},
					},
				);
				(async () => {
					const peers = await this
						.in(participantIDs)
						.fetchSockets();
					this
						.to(socket.id)
						.emit(
							'conversation-joined',
							{
								// let the newly connected socket know who else has joined the conversation
								peers: peers.map((peer) => ({
									socketID: peer.id,
									socketName: peer.data.userName,
								})), 
							},
						);
				})();
			} else {
				socket._error(new Error('Access Denied.'));
			}
		},
	);

	socket.on(
		'offer',
		socketOfferEventListener.bind(socket),
	);

	// socket.on(
	// 	'ping',
	// 	() => {
	// 		(async () => {
	// 			const sockets = await fastify.io.fetchSockets();
	// 			sockets.forEach(() => { /* do something */ });
	// 		})();
	// 	},
	// );
};

export default socketConnectionEventListener;
