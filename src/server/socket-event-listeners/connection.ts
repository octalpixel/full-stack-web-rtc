import { Server, Socket } from 'socket.io';

import socketAnswerEventListener from './answer.js';
import socketDisconnectingEventListener from './disconnecting.js';
import socketICECandidateEventListener from './ice-candidate.js';
import socketOfferEventListener from './offer.js';

const socketConnectionEventListener = (socket: Socket) => {
  const server = this as unknown as Server;
  socket.on(
    'answer',
    socketAnswerEventListener,
  );

  socket.on(
    'disconnecting',
    socketDisconnectingEventListener,
  );

  socket.on(
    'ice-candidate',
    socketICECandidateEventListener,
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
          const peers = await server
            .in(participantIDs)
            .fetchSockets();
          server
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
    socketOfferEventListener,
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
