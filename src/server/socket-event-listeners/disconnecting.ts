import { Socket } from 'socket.io';

const socketDisconnectingEventListener = () => {
  const socket = this as unknown as Socket;
  socket.rooms.forEach(
    (room) => {
      socket
        .to(room)
        .emit(
          'peer-disconnected',
          {
            peer: {
              socketID: socket.id,
              socketName: socket.data.userName,
            },
          },
        );
    },
  );
};

export default socketDisconnectingEventListener;
