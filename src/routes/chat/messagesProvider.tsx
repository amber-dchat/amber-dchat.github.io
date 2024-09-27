import { DMChannel } from '@/lib/Structs/DMChannel/DMChannel';
import { Message } from '@/lib/Structs/Message/Message';
import { createContext, useContext, useEffect, useState } from 'react';
import { useChats } from './chatsProvider';

interface MessageContext {
	channel: DMChannel | null;
	messages: Message[];
}

const MessageProvider = createContext<MessageContext | null>(null);

export function useMessages() {
	return useContext(MessageProvider);
}

export function Messages({ children }: { children: JSX.Element }) {
	const { room, data } = useChats();

	const [messages, setMessage] = useState<Message[]>([]);
	const [channel, setChannel] = useState<DMChannel | null>(null);

	useEffect(() => {
		if (room && data) {
			(async () => {
				console.log(`Room ${fetch}`);
				const channel = await data.getChannel(`@${room}`, () => {
					setMessage(data.getMessages(`@${room}`));
				});

				setChannel(channel);
			})();
		}
	}, [room, data]);

	return (
		<MessageProvider.Provider value={{ messages, channel }}>
			{children}
		</MessageProvider.Provider>
	);
}
