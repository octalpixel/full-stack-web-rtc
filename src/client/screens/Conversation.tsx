import {
	useContext,
	useEffect,
	useReducer,
	useRef,
} from 'react';

import Paper from '@mui/material/Paper/index.js';
import Typography from '@mui/material/Typography/index.js';
import { useParams } from 'react-router-dom';

import {
	ReceiveSDPEventPayload,
	SendSDPEventPayload,
} from '../../types/socket-event-payloads/sdp.js';
import conversationReducer, { ConversationState } from '../reducers/conversation.js';
import AutoScrollMessages from '../components/AutoScrollMessages.jsx';
import Peer from '../components/Peer.jsx';
import PeerInfoPayload from '../../types/socket-event-payloads/peer-info.js';
import { PreferencesContext } from '../contexts/preferences.jsx';
import { ReceiveICECandidateEventPayload } from '../../types/socket-event-payloads/ice-candidate.js';
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
	const [conversationState, dispatchConversationAction] = useReducer(
		conversationReducer,
		{
			peers: {},
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
						// streamRef.current = await navigator.mediaDevices.getDisplayMedia({
						// 	audio: false, 
						// 	video: true,
						// });
						if (cameraFeedVideoRef.current) {
							// eslint-disable-next-line prefer-destructuring
							cameraFeedVideoRef.current.srcObject = streamRef.current;
						}

						socketRef.current?.emit(
							'join-conversation',
							participantIDs,
						);

						socketRef.current?.on(
							'answer',
							({
								fromSocketID,
								sdp: {
									sdp,
									type,
								},
							}: ReceiveSDPEventPayload) => {
								console.log(JSON.stringify(sdp));
								conversationState
									.peers[fromSocketID]
									?.connection
									.setRemoteDescription({
										sdp,
										type,
									});
							},
						);

						socketRef.current?.on(
							'ice-candidate',
							({
								candidate: {
									candidate,
									sdpMLineIndex,
									sdpMid,
									usernameFragment,
								},
								fromSocketID,
							}: ReceiveICECandidateEventPayload) => {
								console.log(`incoming ice candidate: ${JSON.stringify(candidate)}`);
								conversationState
									.peers[fromSocketID]
									?.connection
									.addIceCandidate({
										candidate,
										sdpMLineIndex,
										sdpMid,
										usernameFragment,
									});
							},
						);

						socketRef.current?.on(
							'offer',
							({
								fromSocketID,
								sdp: {
									sdp,
									type,
								},
							}: ReceiveSDPEventPayload) => {
								console.log(`incoming offer: ${sdp}`);
								(async () => {
									await conversationState
										.peers[fromSocketID]
										?.connection
										.setRemoteDescription({
											sdp,
											type,
										});
									console.log('remote description set');
									if (
										conversationState.peers[fromSocketID]
										&& !conversationState.peers[fromSocketID].connection.getSenders().length
										&& streamRef.current
									) {
										streamRef
											.current
											.getTracks()
											.forEach(
												(track) => {
													conversationState
														.peers[fromSocketID]
														.connection
														.addTrack(
															track,
															streamRef.current as MediaStream,
														);
												},
											);
										console.log('tracks added');
									}

									const answer = await conversationState
										.peers[fromSocketID]
										?.connection
										.createAnswer();
									console.log(`answer created: ${JSON.stringify(answer)}`);
									await conversationState
										.peers[fromSocketID]
										?.connection
										.setLocalDescription(answer);
									console.log(`local description set: ${JSON.stringify(conversationState.peers[fromSocketID]?.connection.localDescription)}`);
									socketRef.current?.emit(
										'answer',
										{
											sdp: conversationState.peers[fromSocketID]?.connection.localDescription,
											toSocketID: fromSocketID,
										} as SendSDPEventPayload,
									);
									console.log('answer emitted');
								})();
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
							(payload: PeerInfoPayload) => {
								console.log(`${payload.name} joined the conversation`);
								socketRef.current?.emit(
									'welcome',
									payload.socketID,
								);
								dispatchConversationAction({
									payload,
									type: 'CreatePeer',
								});
								if (streamRef.current) {
									streamRef
										.current
										.getTracks()
										.forEach(
											(track) => {
												conversationState
													.peers[payload.socketID]
													?.connection
													.addTrack(
														track,
														streamRef.current as MediaStream,
													);
											},
										);
								}
							},
						);

						socketRef.current?.on(
							'welcome',
							(payload: PeerInfoPayload) => {
								console.log(`${payload.name} welcomed you to the conversation`);
								dispatchConversationAction({
									payload,
									type: 'CreatePeer',
								});
							},
						);
					} catch (error) {
						console.log(error);
					}
				})();

				return () => {
					socketRef.current?.off('answer');
					// socketRef.current?.off('conversation-joined');
					socketRef.current?.off('ice-candidate');
					socketRef.current?.off('offer');
					socketRef.current?.off('peer-disconnected');
					socketRef.current?.off('peer-joined');
					socketRef.current?.off('welcome');
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
					ref={cameraFeedVideoRef}
					style={{
						height: 'auto',
						width: '50%',
					}}
				/>
				{Object
					.entries(conversationState.peers)
					.map(
						([socketID, peer]) => (
							<Peer
								dispatchConversationAction={dispatchConversationAction}
								key={socketID}
								socketID={socketID}
								{...peer}
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
					Object
						.values(conversationState.peers)
						.forEach(
							({ textChatChannel }) => textChatChannel.send(JSON.stringify(message)),
						);
				}}
			/>
		</>
	);
};

export default Conversation;
