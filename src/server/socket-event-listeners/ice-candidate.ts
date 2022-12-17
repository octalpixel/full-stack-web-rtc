import { Socket } from 'socket.io';

import ICECandidateEventPayload from '../../types/socket-event-payloads/ice-candidate.js';

function socketICECandidateEventListener(
  this: Socket,
  {
    participantIDs,
    candidate,
  }: ICECandidateEventPayload,
) {
  this
    .to(participantIDs)
    .emit(
      `${this.id}-ice-candidate`,
      { candidate },
    );
};

export default socketICECandidateEventListener;
