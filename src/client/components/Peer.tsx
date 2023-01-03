import {
	useEffect,
	useRef,
} from 'react';

import IPerfectRTCPeerConnection from '../../types/perfect-rtc-peer-connection.js';

interface PeerProps {
	connection: IPerfectRTCPeerConnection;
}

const Peer = ({ connection }: PeerProps): JSX.Element => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(
		() => {
			connection.ontrack = (rtcTrackEvent) => {
				rtcTrackEvent.track.onunmute = () => {
					if (
						videoRef.current
						&& !videoRef.current.srcObject
					) {
						// eslint-disable-next-line prefer-destructuring
						videoRef.current.srcObject = rtcTrackEvent.streams[0];
					}
				};

				rtcTrackEvent.track.onmute = () => {
					if (videoRef.current) {
						videoRef.current.srcObject = null;
					}
				};
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
