import { Socket } from 'socket.io';

import AnswerEventPayload from '../../types/socket-event-payloads/answer.js';

function socketAnswerEventListener(
	this: Socket,
	{
		sdp,
		toSocketID,
	}: AnswerEventPayload,
) {
	this
		.to(toSocketID)
		.emit(
			'answer',
			{
				fromSocketID: this.id,
				sdp,
			},
		);
}

export default socketAnswerEventListener;
