import { Socket } from 'socket.io';

import OfferEventPayload from '../../types/socket-event-payloads/offer.js';

const socketOfferEventListener = ({
  participantIDs,
  sdp,
}: OfferEventPayload) => {
  const socket = this as unknown as Socket;
  socket
    .to(participantIDs)
    .emit(
      `${socket.id}-offer`,
      { sdp },
    );
};

export default socketOfferEventListener;
