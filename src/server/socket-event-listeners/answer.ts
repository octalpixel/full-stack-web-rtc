import { Socket } from 'socket.io';

import AnswerEventPayload from '../../types/socket-event-payloads/answer.js';

const socketAnswerEventListener = ({
  participantIDs,
  sdp,
}: AnswerEventPayload) => {
  const socket = this as unknown as Socket;
  socket
    .to(participantIDs)
    .emit(
      `${socket.id}-answer`,
      { sdp },
    );
};

export default socketAnswerEventListener;
