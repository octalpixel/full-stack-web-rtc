import Message from '../../types/message.js';
import PeerInfoPayload from '../../types/socket-event-payloads/peer-info.js';
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
