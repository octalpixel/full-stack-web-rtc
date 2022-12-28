import { Socket } from 'socket.io-client';

import Message from '../../types/message.js';
import PeerInfoPayload from '../../types/socket-event-payloads/peer-info.js';
import { SendICECandidateEventPayload } from '../../types/socket-event-payloads/ice-candidate.js';
import { SendSDPEventPayload } from '../../types/socket-event-payloads/sdp.js';
import rtcConfiguration from '../constants/rtc-configuration.js';

type CreatePeerAction = {
	payload: PeerInfoPayload;
	type: 'CreatePeer';
};

type DisconnectPeerAction = {
	payload: { socketID: string };
	type: 'DisconnectPeer';
};

type RecordTextChatMessageAction = {
	payload: Message;
	type: 'RecordTextChatMessage';
};

export type ConversationAction = CreatePeerAction
	| DisconnectPeerAction
	| RecordTextChatMessageAction;

export type ConversationState = {
	peers: Record<
		string,
		{
			connection: RTCPeerConnection;
			name: string;
			textChatChannel: RTCDataChannel;
		}
	>;
	socket: Socket;
	textChat: Message[];
};

export default function conversationReducer(
	state: ConversationState,
	{
		payload,
		type,
	}: ConversationAction,
): ConversationState {
	const {
		peers,
		socket,
		textChat,
	} = state;
	switch (type) {
		case 'CreatePeer': {
			const {
				name,
				socketID,
			} = payload;
			return {
				...state,
				peers: {
					...peers,
					[socketID]: (() => {
						const connection = new RTCPeerConnection(rtcConfiguration);
						connection.onicecandidate = (rtcPeerConnectionIceEvent) => {
							console.log('ice-candidate');
							if (rtcPeerConnectionIceEvent.candidate) {
								socket.emit(
									'ice-candidate',
									{
										candidate: rtcPeerConnectionIceEvent.candidate,
										toSocketID: socketID,
									} as SendICECandidateEventPayload,
								);
							}
						};

						connection.onnegotiationneeded = () => {
							(async () => {
								console.log('negotiation-needed');
								const offer = await connection.createOffer();
								await connection.setLocalDescription(offer);
								socket.emit(
									'offer',
									{
										sdp: connection.localDescription,
										toSocketID: socketID,
									} as SendSDPEventPayload,
								);
							})();
						};

						return {
							connection,
							name,
							textChatChannel: connection.createDataChannel(
								'text-chat',
								{
									id: 0,
									negotiated: true,
								},
							),
						};
					})(),
				},
			};
		}
		case 'DisconnectPeer': {
			const { socketID } = payload;
			const shallowPeersClone = { ...peers };
			delete shallowPeersClone[socketID];
			return {
				...state,
				peers: shallowPeersClone,
			};
		}
		case 'RecordTextChatMessage': {
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
		default:
			return state;
	}
}
