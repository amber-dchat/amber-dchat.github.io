import { DMChannel } from '@/lib/structs/DMChannel/DMChannel';
import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { useChats } from './chatsProvider';
import { ResolvedMessage } from '@/lib/utils/Chats/chatData';

interface MessageContext {
	channel: DMChannel | null;
	messages: ResolvedMessage[];
}

const MessageProvider = createContext<MessageContext | null>(null);

export function useMessages() {
	return useContext(MessageProvider);
}

const handler = (state: ResolvedMessage[], data: ResolvedMessage | ResolvedMessage[]) => {
	if (Array.isArray(data)) {
		return data;
	}


	const arr = [...state, data];
	arr.sort((a, b) => a.msg.timestamp.getTime() - b.msg.timestamp.getTime());

	return arr;
}

export function Messages({ children }: { children: JSX.Element }) {
	const { room, data } = useChats();

	const [messages, dispatch] = useReducer(handler, [] as ResolvedMessage[], (a) => a);
	const [channel, setChannel] = useState<DMChannel | null>(null);

	useEffect(() => {
		if (room && data) {
			(async () => {
				dispatch([]);
				const channel = await data.getChannel(`@${room}`, (msg) => {
					dispatch(msg);
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
