import { Server, Socket } from 'socket.io';

import JoinConversationEventPayload from '../../types/socket-event-payloads/join-conversation.js';

function socketJoinConversationEventListener(
  this: {
    server: Server;
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
        peer: {
          socketID: this.socket.id,
          socketName: this.socket.data.userName,
        },
      },
    );
    (async () => {
      const peers = await this
        .server
        .in(participantIDs)
        .fetchSockets();
      this
        .server
        .to(this.socket.id)
        .emit(
          'conversation-joined',
          {
            // let the newly connected socket know who else has joined the conversation
            peers: peers.map(
              (peer) => ({
                socketID: peer.id,
                socketName: peer.data.userName,
              }),
            ), 
          },
        );
    })();
  } else {
    this.socket._error(new Error('Access Denied.'));
  }
};

export default socketJoinConversationEventListener;
