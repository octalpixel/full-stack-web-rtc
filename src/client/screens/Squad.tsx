import { useRef } from 'react';

import Paper from '@mui/material/Paper';

const Squad = (): JSX.Element => {
	const peerRef = useRef<RTCPeerConnection>();
	const streamRef = useRef<MediaStream>();

	return (
		<Paper />
	);
};

export default Squad;
