import {
	Dispatch,
	useContext,
	useEffect,
	useRef,
} from 'react';

import { ConversationAction } from '../reducers/conversation.js';
import { UserContext } from '../contexts/user.jsx';

interface PeerProps {
	connection: RTCPeerConnection;
	dispatchConversationAction: Dispatch<ConversationAction>;
	name: string;
	textChatChannel: RTCDataChannel;
}

const Peer = ({
	connection,
	dispatchConversationAction,
	name,
	textChatChannel,
}: PeerProps): JSX.Element => {
	const { socketRef } = useContext(UserContext);
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(
		() => {
			textChatChannel.onmessage = (messageEvent) => {
				dispatchConversationAction({
					payload: JSON.parse(messageEvent.data),
					type: 'RecordTextChatMessage',
				});
			};
			connection.ontrack = (rtcTrackEvent) => {
				if (videoRef.current) {
					// eslint-disable-next-line prefer-destructuring
					videoRef.current.srcObject = rtcTrackEvent.streams[0];
				}
			};
		},
		[],
	);

	return (
		<video
			autoPlay
			controls
			ref={videoRef}
			style={{
				height: 'auto',
				width: '50%',
			}}
		/>
	);
};

export default Peer;
