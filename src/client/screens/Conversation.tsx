import {
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';

import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import AutoScrollMessages from '../components/AutoScrollMessages';
import Message from '../types/message';
import Peer from '../components/Peer';
import { PreferencesContext } from '../contexts/preferences';
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
	const [peersState, setPeersState] = useState<PeerData[]>([]);
	const [textChatState, setTextChatState] = useState<Message[]>([]);
	const [mostRecentSentMessageState, setMostRecentSentMessageState] = useState<Message>();

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
					'conversation-joined',
					({ peers }: { peers: PeerData[] }) => {
						console.log('conversation-joined');
						setPeersState(peers.sort(
							(a, b) => a.socketName.localeCompare(b.socketName),
						));
					},
				);

				socketRef.current?.on(
					'peer-disconnected',
					({ peer }: { peer: PeerData }) => {
						console.log('peer-disconnected');
						setPeersState(
							(prevState) => {
								return prevState.filter(
									(p) => p.socketID !== peer.socketID,
								);
							},
						);
					},
				);

				socketRef.current?.on(
					'peer-joined',
					({ peer }: { peer: PeerData }) => {
						console.log(`${peer.socketName} joined the conversation`);
						setPeersState(
							(prevState) => [...prevState, peer].sort(
								(a, b) => a.socketName.localeCompare(b.socketName),
							),
						);
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
				{peersState.map(
					(peer) => (
						<Peer
							key={peer.socketID}
							mostRecentSentMessageState={mostRecentSentMessageState}
							setTextChatState={setTextChatState}
							socketID={peer.socketID}
							socketName={peer.socketName}
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
