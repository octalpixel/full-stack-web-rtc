interface AnswerEventPayload {
	sdp: RTCSessionDescription;
	toSocketID: string;
}

export default AnswerEventPayload;
