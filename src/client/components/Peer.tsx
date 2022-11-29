import {
	MutableRefObject,
	useContext,
	useEffect,
	useRef,
} from 'react';

import { useParams } from 'react-router-dom';

import { UserContext } from '../contexts/user';
import iceServers from '../constants/ice-servers';

interface PeerProps {
	socketID: string;
	streamRef: MutableRefObject<MediaStream>;
}

const Peer = ({
	socketID,
	streamRef,
}: PeerProps): JSX.Element => {
	const { socketRef } = useContext(UserContext);
	const { conversationID } = useParams();
	const peerRef = useRef<RTCPeerConnection>();
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(
		() => {
			(async () => {
				try {
					peerRef.current = new RTCPeerConnection(iceServers);
					streamRef.current
						?.getTracks()
						.forEach(
							(track) => {
								peerRef.current?.addTrack(
									track,
									streamRef.current as MediaStream,
								);
							},
						);

					peerRef.current.onicecandidate = (rtcPeerConnectionIceEvent) => {
						if (rtcPeerConnectionIceEvent.candidate) {
							socketRef.current?.emit(
								'ice-candidate',
								{
									candidate: rtcPeerConnectionIceEvent.candidate,
									conversationID,
								},
							);
						}
					};

					peerRef.current.onnegotiationneeded = () => {
						(async () => {
							const offer = await peerRef.current?.createOffer();
							await peerRef.current?.setLocalDescription(offer);
							socketRef.current?.emit(
								'offer',
								{
									conversationID,
									sdp: peerRef.current?.localDescription,
								},
							);
						})();
					};

					peerRef.current.ontrack = (rtcTrackEvent) => {
						const { streams: [stream] } = rtcTrackEvent;
						if (videoRef.current) videoRef.current.srcObject = stream;
					};
				} catch (error) {
					console.log(error);
				}
			})();

			socketRef.current?.on(
				`${socketID}-answer`,
				({ sdp }) => {
					(async () => {
						try {
							await peerRef.current?.setRemoteDescription(new RTCSessionDescription(sdp));
						} catch (error) {
							console.log(error);
						}
					})();
				},
			);

			socketRef.current?.on(
				`${socketID}-ice-candidate`,
				({ candidate }) => {
					if (peerRef.current?.remoteDescription) {
						peerRef.current.addIceCandidate(candidate);
					} else {
						const timer = setInterval(
							() => {
								if (peerRef.current?.remoteDescription) {
									clearInterval(timer);
									peerRef.current.addIceCandidate(candidate);
								}
							},
							100,
						);
					}
				},
			);

			socketRef.current?.on(
				`${socketID}-offer`,
				({ sdp }) => {
					(async () => {
						try {
							await peerRef.current?.setRemoteDescription(new RTCSessionDescription(sdp));
							const answer = await peerRef.current?.createAnswer();
							await peerRef.current?.setLocalDescription(answer);
							socketRef.current?.emit(
								'answer',
								{
									conversationID,
									sdp: peerRef.current?.localDescription,
								},
							);
						} catch (error) {
							console.log(error);
						}
					})();
				},
			);

			return () => {
				peerRef.current?.close();
				socketRef.current?.off(`${socketID}-answer`);
				socketRef.current?.off(`${socketID}-ice-candidate`);
				socketRef.current?.off(`${socketID}-offer`);
			};
		},
		[],
	);

	return (
		<video
			autoPlay
			controls
			ref={videoRef}
		/>
	);
};

export default Peer;
