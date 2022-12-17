import { Socket } from 'socket.io';

import ICECandidateEventPayload from '../../types/socket-event-payloads/ice-candidate.js';

const socketICECandidateEventListener = ({
  participantIDs,
  candidate,
}: ICECandidateEventPayload) => {
  const socket = this as unknown as Socket;
  socket
    .to(participantIDs)
    .emit(
      `${socket.id}-ice-candidate`,
      { candidate },
    );
};

export default socketICECandidateEventListener;
