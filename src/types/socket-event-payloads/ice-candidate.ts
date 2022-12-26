interface ICECandidateEventPayload {
	candidate: RTCIceCandidate;
	toSocketID: string;
}

export default ICECandidateEventPayload;
