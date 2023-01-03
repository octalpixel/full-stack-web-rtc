import React, {
	MouseEventHandler,
	useContext,
} from 'react';

import CallEndIcon from '@mui/icons-material/CallEnd.js';
import MicIcon from '@mui/icons-material/Mic.js';
import MicOffIcon from '@mui/icons-material/MicOff.js';
import ScreenShareIcon from '@mui/icons-material/ScreenShare.js';
import SpeedDial from '@mui/material/SpeedDial/index.js';
import SpeedDialAction from '@mui/material/SpeedDialAction/index.js';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare.js';
import VideocamIcon from '@mui/icons-material/Videocam.js';
import VideocamOffIcon from '@mui/icons-material/VideocamOff.js';
import { useParams } from 'react-router-dom';

import { ConversationContext } from '../contexts/conversation.jsx';

const ConversationActions = (): JSX.Element => {
	const {
		cameraStreamRef,
		micStreamRef,
		peersRef,
		setSharingCamera,
		setSharingMic,
		setSharingScreen,
		sharingCamera,
		sharingMic,
		sharingScreen,
	} = useContext(ConversationContext);
	const { participantIDs } = useParams();
	const actions: Array<{
		icon: JSX.Element;
		name: string;
		onClick: MouseEventHandler<HTMLButtonElement>;
	}> = [];

	if (sharingCamera) {
		actions.push ({
			icon: <VideocamOffIcon />,
			name: 'Stop Sharing Camera',
			onClick(){
				if (cameraStreamRef.current) {
					cameraStreamRef.current.getVideoTracks()[0].enabled = false;
				}
				setSharingCamera(false); 
			},
		});
	} else {
		actions.push ({
			icon: <VideocamIcon />,
			name: 'Start Sharing Camera',
			onClick(){
				if (cameraStreamRef.current) {
					cameraStreamRef.current.getVideoTracks()[0].enabled = true;
					setSharingCamera(true);
				} else {
					(async () => {
						try {
							cameraStreamRef.current = await navigator.mediaDevices.getUserMedia({
								audio: true,
								video: true,
							});
							Object
								.values(peersRef.current)
								.forEach(
									(connection) => {
										if (cameraStreamRef.current) {
											cameraStreamRef
												.current
												.getTracks()
												.forEach(
													(track) => {
														connection.addTrack(
															track,
															cameraStreamRef.current as MediaStream,
														);
													},
												);
										}
									},
								);
							setSharingCamera(true);
							setSharingMic(true);
						} catch (error) {
							console.error(error);
						}
					})();
				}
			},
		});
	}

	if (sharingMic) {
		actions.push ({
			icon: <MicOffIcon />,
			name: 'Stop Sharing Microphone',
			onClick(){
				if (cameraStreamRef.current) {
					cameraStreamRef.current.getAudioTracks()[0].enabled = false;
				} else if (micStreamRef.current) {
					micStreamRef.current.getAudioTracks()[0].enabled = false;
				}
				setSharingMic(false); 
			},
		});
	} else {
		actions.push ({
			icon: <MicIcon />,
			name: 'Start Sharing Microphone',
			onClick(){
				if (cameraStreamRef.current) {
					cameraStreamRef.current.getAudioTracks()[0].enabled = true;
					setSharingMic(true);
				} else if (micStreamRef.current) {
					micStreamRef.current.getAudioTracks()[0].enabled = true;
					setSharingMic(true);
				} else {
					(async () => {
						try {
							micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
							setSharingMic(true);
						} catch (error) {
							console.error(error);
						}
					})();
				}
			},
		});
	}

	if (sharingScreen) {
		actions.push ({
			icon: <StopScreenShareIcon />,
			name: 'Stop Sharing Screen',
			onClick(){
				setSharingScreen(false); 
			},
		});
	} else {
		actions.push ({
			icon: <ScreenShareIcon />,
			name: 'Start Sharing Screen',
			onClick(){
				setSharingScreen(true); 
			},
		});
	}

	// (async () => {
	// 	try {
	// 		streamRef.current = await navigator.mediaDevices.getUserMedia({
	// 			audio: true,
	// 			video: true,
	// 		});
	// 		// streamRef.current = await navigator.mediaDevices.getDisplayMedia({
	// 		// 	audio: false, 
	// 		// 	video: true,
	// 		// });
	// 		if (cameraFeedVideoRef.current) {
	// 			// eslint-disable-next-line prefer-destructuring
	// 			cameraFeedVideoRef.current.srcObject = streamRef.current;
	// 		}

	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// })();

	return (
		<SpeedDial
			ariaLabel="conversation-actions"
			direction="down"
		>
			{actions.map(
				(action) => (
					<SpeedDialAction
						FabProps={{ onClick: action.onClick }}
						icon={action.icon}
						key={action.name}
						title={action.name}
					/>
				),
			)}
		</SpeedDial>
	);
};

export default ConversationActions;
