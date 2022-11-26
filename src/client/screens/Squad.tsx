import { useRef } from 'react';

import Paper from '@mui/material/Paper';
import { useParams } from 'react-router-dom';

const Squad = (): JSX.Element => {
	const { squadID } = useParams();
	const peerRef = useRef<RTCPeerConnection>();
	const streamRef = useRef<MediaStream>();

	return (
		<Paper />
	);
};

export default Squad;
