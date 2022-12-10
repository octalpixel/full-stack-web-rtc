import {
	Dispatch,
	MutableRefObject,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useRef,
} from 'react';
import { useParams } from 'react-router-dom';

import Message from '../types/message';
import { UserContext } from '../contexts/user';
import rtcConfiguration from '../constants/rtc-configuration';

interface PeerProps {
	peerConnection: RTCPeerConnection;
}

const Peer = ({ peerConnection }: PeerProps): JSX.Element => {
	const { socketRef } = useContext(UserContext);
	const textChatChannelRef = useRef<RTCDataChannel>();
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(
		() => {
			socketRef.current?.on(
				`${socketID}-peer-connection-requested`,
				() => {
					console.log('peer-connection-requested');
					createRTCPeerConnection();
					textChatChannelRef.current = peerRef.current?.createDataChannel('text-chat');

					if (textChatChannelRef.current) {
						textChatChannelRef.current.onmessage = handleIncomingTextChatMessage;
					}

					if (streamRef.current) {
						streamRef.current
							.getTracks()
							.forEach(
								(track) => {
									peerRef.current?.addTrack(
										track,
										streamRef.current as MediaStream,
									);
								},
							);
					} else {
						const timer = setInterval(
							() => {
								if (streamRef.current) {
									clearInterval(timer);
									streamRef.current
										.getTracks()
										.forEach(
											(track) => {
												peerRef.current?.addTrack(
													track,
													streamRef.current as MediaStream,
												);
											},
										);
								}
							},
							100,
						);
					}
				},
			);

			return () => {
				socketRef.current?.off(`${socketID}-peer-connection-requested`);
			};
		},
		[],
	);

	useEffect(
		() => {
			
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
