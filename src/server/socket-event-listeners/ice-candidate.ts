import { Socket } from 'socket.io';

import ICECandidateEventPayload from '../../types/socket-event-payloads/ice-candidate.js';

function socketICECandidateEventListener(
	this: Socket,
	{
		candidate,
		toSocketID,
	}: ICECandidateEventPayload,
) {
	this
		.to(toSocketID)
		.emit(
			'ice-candidate',
			{
				candidate,
				fromSocketID: this.id,
			},
		);
}

export default socketICECandidateEventListener;
