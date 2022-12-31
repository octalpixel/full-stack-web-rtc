import {
	Dispatch,
	useContext,
	useEffect,
	useRef,
} from 'react';

import { ConversationAction } from '../reducers/conversation.js';
import { SendICECandidateEventPayload } from '../../types/socket-event-payloads/ice-candidate.js';
import { SendSDPEventPayload } from '../../types/socket-event-payloads/sdp.js';
import { UserContext } from '../contexts/user.jsx';

interface PeerProps {
	connection: RTCPeerConnection;
	dispatchConversationAction: Dispatch<ConversationAction>;
	name: string;
	socketID: string;
	textChatChannel: RTCDataChannel;
}

const Peer = ({
	connection,
	dispatchConversationAction,
	name,
	socketID,
	textChatChannel,
}: PeerProps): JSX.Element => {
	const { socketRef } = useContext(UserContext);
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(
		() => {
			connection.onicecandidate = (rtcPeerConnectionIceEvent) => {
				console.log('ice-candidate');
				if (rtcPeerConnectionIceEvent.candidate) {
					socketRef.current?.emit(
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
					socketRef.current?.emit(
						'offer',
						{
							sdp: connection.localDescription,
							toSocketID: socketID,
						} as SendSDPEventPayload,
					);
				})();
			};

			connection.ontrack = (rtcTrackEvent) => {
				if (videoRef.current) {
					// eslint-disable-next-line prefer-destructuring
					videoRef.current.srcObject = rtcTrackEvent.streams[0];
				}
			};

			textChatChannel.onmessage = (messageEvent) => {
				dispatchConversationAction({
					payload: JSON.parse(messageEvent.data),
					type: 'RecordTextChatMessage',
				});
			};
		},
		[],
	);

	return (
		<video
			autoPlay
			ref={videoRef}
			style={{
				height: 'auto',
				width: '50%',
			}}
		/>
	);
};

export default Peer;
