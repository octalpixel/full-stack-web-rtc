interface ICECandidateEventPayload {
  participantIDs: string;
  candidate: RTCIceCandidate;
};

export default ICECandidateEventPayload;
