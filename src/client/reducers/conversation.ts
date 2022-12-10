import { Dispatch } from 'react';
import { Socket } from 'socket.io-client';

import Message from '../types/message';
import rtcConfiguration from '../constants/rtc-configuration';

type CreatePeerAction = {
	payload: { socketID: string };
	type: 'CreatePeer';
};

type DisconnectPeerAction = {
	payload: { socketID: string };
	type: 'DisconnectPeer';
}

type RecordAnswerAction = {
	payload: {
		sdp: RTCSessionDescriptionInit;
		socketID: string;
	};
	type: 'RecordAnswer';
};

type RecordICECandidateAction = {
	payload: {
		candidate: RTCIceCandidateInit;
		socketID: string;
	};
	type: 'RecordICECandidate';
};

type RecordTextChatMessageAction = {
	payload: Message;
	type: 'RecordTextChatMessage';
};

type RespondToOfferAction = {
	payload: {
		sdp: RTCSessionDescriptionInit;
		socketID: string;
	};
	type: 'RespondToOffer';
};

type ConversationAction = CreatePeerAction
	| DisconnectPeerAction
	| RecordAnswerAction
	| RecordICECandidateAction
	| RecordTextChatMessageAction
	| RespondToOfferAction;

export type ConversationState = {
	dispatchConversationAction: Dispatch<ConversationAction>;
	participantIDs: string;
	peers: Record<string, RTCPeerConnection>;
	socket: Socket;
	stream: MediaStream;
	textChat: Message[];
};

export default function conversationReducer(
	state: ConversationState,
	action: ConversationAction,
): ConversationState {
	const {
		dispatchConversationAction,
		participantIDs,
		peers,
		socket,
		stream,
		textChat,
	} = state;
	const createRTCPeerConnection = () => {
		const peer = new RTCPeerConnection(rtcConfiguration);
		peer.onicecandidate = (rtcPeerConnectionIceEvent) => {
			console.log('ice-candidate');
			if (rtcPeerConnectionIceEvent.candidate) {
				socket.emit(
					'ice-candidate',
					{
						candidate: rtcPeerConnectionIceEvent.candidate,
						participantIDs,
					},
				);
			}
		};

		peer.onnegotiationneeded = () => {
			(async () => {
				console.log('negotiation-needed');
				const offer = await peer.createOffer();
				await peer.setLocalDescription(offer);
				socket.emit(
					'offer',
					{
						participantIDs,
						sdp: peer.localDescription,
					},
				);
			})();
		};

		// peer.ontrack = (rtcTrackEvent) => {
		// 	console.log('track');
		// 	// eslint-disable-next-line prefer-destructuring
		// 	if (videoRef.current) videoRef.current.srcObject = rtcTrackEvent.streams[0];
		// };

		return peer;
	};

	switch (action.type) {
		case 'CreatePeer': {
			const { payload: { socketID } } = action;

			return {
				...state,
				peers: {
					...peers,
					[socketID]: createRTCPeerConnection(),
				},
			};
		}
		case 'DisconnectPeer': {
			const { payload: { socketID } } = action;
			const shallowPeersClone = { ...peers };
			delete shallowPeersClone[socketID];
			return {
				...state,
				peers: shallowPeersClone,
			};
		}
		case 'RecordAnswer': {
			const {
				payload: {
					sdp,
					socketID,
				},
			} = action;
			peers[socketID].setRemoteDescription(sdp);
			return state;
		}
		case 'RecordICECandidate': {
			const {
				payload: {
					candidate,
					socketID,
				},
			} = action;
			peers[socketID].addIceCandidate(candidate);
			return state;
		}
		case 'RecordTextChatMessage': {
			const { payload } = action;
			return {
				...state,
				textChat: [...textChat, payload].sort(
					(a, b) => {
						if (a.timestamp > b.timestamp) return -1;
						if (a.timestamp < b.timestamp) return 1;
						return 0;
					},
				),
			};
		}
		case 'RespondToOffer': {
			const {
				payload: {
					sdp,
					socketID,
				},
			} = action;
			const peer = createRTCPeerConnection();
			peer.ondatachannel = (rtcDataChannelEvent) => {
				switch (rtcDataChannelEvent.channel.label) {
					case 'text-chat':
						rtcDataChannelEvent.channel.onmessage = (messageEvent) => {
							dispatchConversationAction({
								payload: JSON.parse(messageEvent.data),
								type: 'RecordTextChatMessage',
							});
						};
						return;
					default:
						return;
				}
			};
			(async () => {
				await peer.setRemoteDescription(sdp);
				stream
					.getTracks()
					.forEach(
						(track) => {
							console.log('track added');
							peer.addTrack(
								track,
								stream,
							);
						},
					);
				const answer = await peer.createAnswer();
				await peer.setLocalDescription(answer);
				socket.emit(
					'answer',
					{
						participantIDs,
						sdp: peer.localDescription,
					},
				);
			})();
			return {
				...state,
				peers: {
					...peers,
					[socketID]: peer,
				},
			};
		}
		default:
			return state;
	}
}
