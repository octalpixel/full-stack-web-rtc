import {
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';

import Paper from '@mui/material/Paper';
import { useParams } from 'react-router-dom';

import { UserContext } from '../contexts/user';

const Conversation = (): JSX.Element => {
	const { socketRef } = useContext(UserContext);
	const { conversationID } = useParams();
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

			return () => {
				// socketRef.current?.off('');
			};
		},
	);

	return (
		<Paper>
			{}
		</Paper>
	);
};

export default Conversation;
