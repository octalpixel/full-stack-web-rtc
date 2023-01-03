import React, {
	useContext,
	useEffect,
	useRef,
} from 'react';

import { ConversationContext } from '../contexts/conversation.jsx';

const CameraFeed = (): JSX.Element => {
	const {
		cameraStreamRef,
		sharingCamera,
	} = useContext(ConversationContext);
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(
		() => {
			if (
				sharingCamera
				&& videoRef.current
				&& cameraStreamRef.current
				&& !videoRef.current.srcObject
			) {
				// eslint-disable-next-line prefer-destructuring
				videoRef.current.srcObject = cameraStreamRef.current;
			}
		},
		[sharingCamera],
	);

	return (
		<video
			autoPlay
			hidden={!sharingCamera}
			ref={videoRef}
			style={{
				height: 'auto',
				width: '50%',
			}}
		/>
	);
};

export default CameraFeed;
