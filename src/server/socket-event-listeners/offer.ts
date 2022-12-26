import { Socket } from 'socket.io';

import OfferEventPayload from '../../types/socket-event-payloads/offer.js';

function socketOfferEventListener(
	this: Socket,
	{
		sdp,
		toSocketID,
	}: OfferEventPayload,
) {
	this
		.to(toSocketID)
		.emit(
			'offer',
			{
				fromSocketID: this.id,
				sdp,
			},
		);
}

export default socketOfferEventListener;
