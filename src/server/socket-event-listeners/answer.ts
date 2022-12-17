import { Socket } from 'socket.io';

import AnswerEventPayload from '../../types/socket-event-payloads/answer.js';

function socketAnswerEventListener(
  this: Socket,
  {
    participantIDs,
    sdp,
  }: AnswerEventPayload,
) {
  this
    .to(participantIDs)
    .emit(
      `${this.id}-answer`,
      { sdp },
    );
};

export default socketAnswerEventListener;
