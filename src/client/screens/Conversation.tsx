import {
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';

import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

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
	const streamRef = useRef<MediaStream>();
	const [peersState, setPeersState] = useState<PeerData[]>([]);

	useEffect(
		() => {
			(async () => {
				try {
					streamRef.current = await navigator.mediaDevices.getUserMedia({
						audio: true,
						video: true,
					});
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
				({ peers }: { peers: PeerData[] }) => setPeersState(peers.sort(
					(a, b) => a.socketName.localeCompare(b.socketName),
				)),
			);

			socketRef.current?.on(
				'peer-disconnected',
				({ peer }: { peer: PeerData }) => {
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
				({ peer }: { peer: PeerData }) => setPeersState((prevState) => [...prevState, peer].sort(
					(a, b) => a.socketName.localeCompare(b.socketName),
				)),
			);

			return () => {
				socketRef.current?.off('conversation-joined');
				socketRef.current?.off('peer-joined');
			};
		},
		[participantIDs],
	);

	if (!participantIDs?.includes(userID)) {
		return (
			<Paper>
				<Typography variant="h1">
					{multilingualDictionary.AccessDenied[languageState]}
				</Typography>
			</Paper>
		);
	}

	return (
		<Paper>
			{peersState.map(
				(peer) => (
					<Peer
						key={peer.socketID}
						socketID={peer.socketID}
						socketName={peer.socketName}
						streamRef={streamRef}
					/>
				),
			)}
		</Paper>
	);
};

export default Conversation;
