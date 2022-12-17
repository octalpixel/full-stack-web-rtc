import { Socket } from 'socket.io';

import OfferEventPayload from '../../types/socket-event-payloads/offer.js';

function socketOfferEventListener(
  this: Socket,
  {
    participantIDs,
    sdp,
  }: OfferEventPayload,
) {
  this
    .to(participantIDs)
    .emit(
      `${this.id}-offer`,
      { sdp },
    );
};

export default socketOfferEventListener;
