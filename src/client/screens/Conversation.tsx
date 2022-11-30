import {
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';

import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { PreferencesContext } from '../contexts/preferences';
import { UserContext } from '../contexts/user';
import multilingualDictionary from '../constants/multilingual-dictionary';

const Conversation = (): JSX.Element => {
	const { languageState } = useContext(PreferencesContext);
	const {
		socketRef,
		userState: { userID },
	} = useContext(UserContext);
	const { participantIDs } = useParams();
	const streamRef = useRef<MediaStream>();
	// const [peersState, setPeersState] = useState

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

			return () => {
				socketRef.current?.off('join-conversation');
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
			{}
		</Paper>
	);
};

export default Conversation;
