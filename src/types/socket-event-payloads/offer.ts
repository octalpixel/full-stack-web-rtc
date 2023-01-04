interface OfferEventPayload {
	participantIDs: string;
	sdp: RTCSessionDescription;
}

export default OfferEventPayload;
