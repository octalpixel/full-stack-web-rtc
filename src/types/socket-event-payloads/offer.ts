interface OfferEventPayload {
	sdp: RTCSessionDescription;
	toSocketID: string;
}

export default OfferEventPayload;
