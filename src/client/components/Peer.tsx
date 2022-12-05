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
	mostRecentSentMessageState?: Message;
	setTextChatState: Dispatch<SetStateAction<Message[]>>;
	socketID: string;
	socketName: string;
	streamRef: MutableRefObject<MediaStream | undefined>;
}

const Peer = ({
	mostRecentSentMessageState,
	setTextChatState,
	socketID,
	socketName,
	streamRef,
}: PeerProps): JSX.Element => {
	const { socketRef } = useContext(UserContext);
	const { participantIDs } = useParams();
	const textChatChannelRef = useRef<RTCDataChannel>();
	const peerRef = useRef<RTCPeerConnection>();
	const videoRef = useRef<HTMLVideoElement>(null);

	const createRTCPeerConnection = () => {
		peerRef.current = new RTCPeerConnection(rtcConfiguration);
		peerRef.current.onicecandidate = (rtcPeerConnectionIceEvent) => {
			console.log('ice-candidate');
			if (rtcPeerConnectionIceEvent.candidate) {
				socketRef.current?.emit(
					'ice-candidate',
					{
						candidate: rtcPeerConnectionIceEvent.candidate,
						participantIDs,
					},
				);
			}
		};

		peerRef.current.onnegotiationneeded = () => {
			(async () => {
				console.log('negotiation-needed');
				const offer = await peerRef.current?.createOffer();
				await peerRef.current?.setLocalDescription(offer);
				socketRef.current?.emit(
					'offer',
					{
						participantIDs,
						sdp: peerRef.current?.localDescription,
					},
				);
			})();
		};

		peerRef.current.ontrack = (rtcTrackEvent) => {
			console.log('track');
			// eslint-disable-next-line prefer-destructuring
			if (videoRef.current) videoRef.current.srcObject = rtcTrackEvent.streams[0];
		};
	};

	const handleIncomingTextChatMessage = useCallback(
		(messageEvent: MessageEvent) => {
			setTextChatState((prevState) => [...prevState, JSON.parse(messageEvent.data) as Message].sort(
				(a, b) => {
					if (a.timestamp > b.timestamp) return -1;
					if (a.timestamp < b.timestamp) return 1;
					return 0;
				},
			));
		},
		[setTextChatState],
	);

	useEffect(
		() => {
			socketRef.current?.on(
				`${socketID}-answer`,
				({ sdp }) => {
					console.log('answer');
					peerRef.current?.setRemoteDescription(new RTCSessionDescription(sdp));
				},
			);

			socketRef.current?.on(
				`${socketID}-ice-candidate`,
				({ candidate }) => {
					console.log('ice-candidate');
					peerRef.current?.addIceCandidate(candidate);
				},
			);

			socketRef.current?.on(
				`${socketID}-offer`,
				({ sdp }) => {
					console.log('offer');
					// if (!peerRef.current) {
					createRTCPeerConnection();
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						peerRef.current!.ondatachannel = (rtcDataChannelEvent) => {
							switch (rtcDataChannelEvent.channel.label) {
								case 'text-chat':
									// eslint-disable-next-line prefer-destructuring
									textChatChannelRef.current = rtcDataChannelEvent.channel;
									textChatChannelRef.current.onmessage = handleIncomingTextChatMessage;
									return;
								default:
									return;
							}
						};
					// }

						(async () => {
							await peerRef.current?.setRemoteDescription(new RTCSessionDescription(sdp));
							streamRef.current
								?.getTracks()
								.forEach(
									(track) => {
										if (peerRef.current) {
											console.log('track added');
											console.log(streamRef.current);
											peerRef.current.addTrack(
												track,
												streamRef.current as MediaStream,
											);
										}
									},
								);
							const answer = await peerRef.current?.createAnswer();
							await peerRef.current?.setLocalDescription(answer);
							socketRef.current?.emit(
								'answer',
								{
									participantIDs,
									sdp: peerRef.current?.localDescription,
								},
							);
						})();
				},
			);

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
				socketRef.current?.off(`${socketID}-answer`);
				socketRef.current?.off(`${socketID}-ice-candidate`);
				socketRef.current?.off(`${socketID}-offer`);
				socketRef.current?.off(`${socketID}-peer-connection-requested`);
			};
		},
		[],
	);

	useEffect(
		() => {
			if (mostRecentSentMessageState) {
				textChatChannelRef.current?.send(JSON.stringify(mostRecentSentMessageState));
			}
		},
		[mostRecentSentMessageState],
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
