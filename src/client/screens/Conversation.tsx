import {
	useContext,
	useEffect,
	useReducer,
	useRef,
} from 'react';
import { Socket } from 'socket.io-client';

import Paper from '@mui/material/Paper/index.js';
import Typography from '@mui/material/Typography/index.js';
import { useParams } from 'react-router-dom';

import conversationReducer, { ConversationState } from '../reducers/conversation.js';
import AutoScrollMessages from '../components/AutoScrollMessages.jsx';
import JoinConversationEventPayload from '../../types/socket-event-payloads/join-conversation.js';
import Peer from '../components/Peer.jsx';
import PeerInfoPayload from '../../types/socket-event-payloads/peer-info.js';
import { PreferencesContext } from '../contexts/preferences.jsx';
import { ReceiveICECandidateEventPayload } from '../../types/socket-event-payloads/ice-candidate.js';
import { ReceiveSDPEventPayload } from '../../types/socket-event-payloads/sdp.js';
import { UserContext } from '../contexts/user.jsx';
import multilingualDictionary from '../constants/multilingual-dictionary.js';

const Conversation = (): JSX.Element => {
	const { languageState } = useContext(PreferencesContext);
	const {
		socketRef,
		userState: { userID },
	} = useContext(UserContext);
	const { participantIDs } = useParams();
	const cameraFeedVideoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream>();
	// const [peersState, setPeersState] = useState<PeerData[]>([]);
	const [conversationState, dispatchConversationAction] = useReducer(
		conversationReducer,
		{
			dispatchConversationAction: () => { /*  */ },
			participantIDs: '',
			peers: {},
			socket: null as unknown as Socket,
			stream: null as unknown as MediaStream,
			textChat: [],
		} as ConversationState,
	);

	useEffect(
		() => {
			if (userID) {
				(async () => {
					try {
						streamRef.current = await navigator.mediaDevices.getUserMedia({
							audio: true,
							video: true,
						});
						if (cameraFeedVideoRef.current) {
							// eslint-disable-next-line prefer-destructuring
							cameraFeedVideoRef.current.srcObject = streamRef.current;
						}
						// streamRef.current = await navigator.mediaDevices.getDisplayMedia({
						// 	audio: false, 
						// 	video: true,
						// });
					} catch (error) {
						console.log(error);
					}
				})();

				socketRef.current?.emit(
					'join-conversation',
					{ participantIDs } as JoinConversationEventPayload,
				);

				socketRef.current?.on(
					'answer',
					(payload: ReceiveSDPEventPayload) => {
						console.log('answer');
						dispatchConversationAction({
							payload,
							type: 'RecordAnswer',
						});
					},
				);

				// socketRef.current?.on(
				// 	'conversation-joined',
				// 	(peers: PeerData[]) => {
				// 		console.log('conversation-joined');
				// 		peers.forEach(
				// 			({ socketID }) => {
				// 				dispatchConversationAction({
				// 					payload: { socketID },
				// 					type: 'CreatePeer',
				// 				});
				// 			},
				// 		);
				// 	},
				// );

				socketRef.current?.on(
					'ice-candidate',
					(payload: ReceiveICECandidateEventPayload) => {
						dispatchConversationAction({
							payload,
							type: 'RecordICECandidate',
						});
					},
				);

				socketRef.current?.on(
					'offer',
					(payload: ReceiveSDPEventPayload) => {
						dispatchConversationAction({
							payload,
							type: 'RespondToOffer',
						});
					},
				);

				socketRef.current?.on(
					'peer-disconnected',
					({ socketID }: { socketID: string }) => {
						console.log('peer-disconnected');
						dispatchConversationAction({
							payload: { socketID },
							type: 'DisconnectPeer',
						});
					},
				);

				socketRef.current?.on(
					'peer-joined',
					(peer: PeerInfoPayload) => {
						console.log(`${peer.name} joined the conversation`);
						dispatchConversationAction({
							payload: { socketID: peer.socketID },
							type: 'CreatePeer',
						});
						socketRef.current?.emit(
							'greet-peer',
							peer.socketID,
						);
					},
				);

				return () => {
					socketRef.current?.off('answer');
					// socketRef.current?.off('conversation-joined');
					socketRef.current?.off('ice-candidate');
					socketRef.current?.off('offer');
					socketRef.current?.off('peer-disconnected');
					socketRef.current?.off('peer-joined');
				};
			}
		},
		[participantIDs, userID],
	);

	useEffect(
		() => {
			return () => {
				streamRef.current
					?.getTracks()
					.forEach(
						(track) => track.stop(),
					);
			};
		},
		[],
	);

	if (
		!userID
		|| (
			userID
			&& !participantIDs?.includes(userID)
		)
	) {
		return (
			<Paper>
				<Typography variant="h1">
					{multilingualDictionary.AccessDenied[languageState]}
				</Typography>
			</Paper>
		);
	}

	return (
		<>
			<Paper>
				<video
					autoPlay
					controls
					ref={cameraFeedVideoRef}
					style={{
						height: 'auto',
						width: '50%',
					}}
				/>
				{Object
					.entries(conversationState.peers)
					.map(
						([socketID, peerConnection]) => (
							<Peer
								key={socketID}
								peerConnection={peerConnection}
							/>
						),
					)}
			</Paper>
			<AutoScrollMessages
				messages={conversationState.textChat}
				submitFunction={(message) => {
					dispatchConversationAction({
						payload: message,
						type: 'RecordTextChatMessage',
					});
				}}
			/>
		</>
	);
};

export default Conversation;
