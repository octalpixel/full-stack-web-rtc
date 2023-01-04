interface ICECandidateEventPayload {
	candidate: RTCIceCandidate;
	participantIDs: string;
}

export default ICECandidateEventPayload;
