import {
	useContext,
	useEffect,
	useReducer,
	useRef,
	useState,
} from 'react';

import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import conversationReducer, { ConversationState } from '../reducers/conversation';
import AutoScrollMessages from '../components/AutoScrollMessages';
import Peer from '../components/Peer';
import { PreferencesContext } from '../contexts/preferences';
import { Socket } from 'socket.io-client';
import { UserContext } from '../contexts/user';
import multilingualDictionary from '../constants/multilingual-dictionary';

interface PeerData {
	socketID: string;
	socketName: string;
}

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
					{ participantIDs },
				);

				socketRef.current?.on(
					'answer',
					({
						sdp,
						socketID,
					}: {
						sdp: RTCSessionDescriptionInit;
						socketID: string;
					}) => {
						console.log('answer');
						dispatchConversationAction({
							payload: {
								sdp,
								socketID,
							},
							type: 'RecordAnswer',
						});
					},
				);

				socketRef.current?.on(
					'conversation-joined',
					({ peers }: { peers: PeerData[] }) => {
						console.log('conversation-joined');
						peers.forEach(
							({ socketID }) => {
								dispatchConversationAction({
									payload: { socketID },
									type: 'CreatePeer',
								});
							},
						);
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
					({ peer }: { peer: PeerData }) => {
						console.log(`${peer.socketName} joined the conversation`);
						dispatchConversationAction({
							payload: { socketID: peer.socketID },
							type: 'CreatePeer',
						});
						socketRef.current?.emit(
							'peer-connection-request',
							{
								participantIDs,
								socketID: peer.socketID,
							},
						);
					},
				);

				return () => {
					socketRef.current?.off('answer');
					socketRef.current?.off('conversation-joined');
					socketRef.current?.off('peer-disconnected');
					socketRef.current?.off('peer-joined');
				};
			}
		},
		[participantIDs, userID],
	);

	// useEffect(
	// 	() => {
	// 		return () => {
	// 			streamRef.current
	// 				?.getTracks()
	// 				.forEach(
	// 					(track) => track.stop(),
	// 				);
	// 		};
	// 	},
	// 	[],
	// );

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
								mostRecentSentMessageState={mostRecentSentMessageState}
								setTextChatState={setTextChatState}
								socketID={socketID}
								socketName={socketName}
								streamRef={streamRef}
							/>
						),
					)}
			</Paper>
			<AutoScrollMessages
				messages={textChatState}
				submitFunction={(message) => {
					setTextChatState((prevState) => [...prevState, message].sort(
						(a, b) => {
							if (a.timestamp > b.timestamp) return -1;
							if (a.timestamp < b.timestamp) return 1;
							return 0;
						},
					));
					setMostRecentSentMessageState(message);
				}}
			/>
		</>
	);
};

export default Conversation;
