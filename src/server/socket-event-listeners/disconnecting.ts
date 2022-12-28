import { Socket } from 'socket.io';

function socketDisconnectingEventListener(this: Socket) {
	this.rooms.forEach(
		(room) => {
			this
				.to(room)
				.emit(
					'peer-disconnected',
					{
						socketID: this.id,
						socketName: this.data.userName,
					},
				);
		},
	);
}

export default socketDisconnectingEventListener;
