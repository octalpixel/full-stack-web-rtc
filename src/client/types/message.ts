interface Message {
	content: string;
	displayed: boolean;
	id: string;
	sender: string;
	timestamp: number;
}

export default Message;
