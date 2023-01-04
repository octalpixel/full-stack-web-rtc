interface AnswerEventPayload {
	participantIDs: string;
	sdp: RTCSessionDescription;
}

export default AnswerEventPayload;
