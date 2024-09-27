import { usePageData } from '@/hooks';
import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';
import { useMainUser, UserContextValues } from '@/hooks/user/useMainUser';
import { ChatData } from '@/lib/utils/Chats/chatData';
import { createContext, useContext, useState } from 'react';

interface FullChatData {
	data: ChatData;
	friends: PeerUser[];
	room: string | null;
}

const ChatContext = createContext<FullChatData | undefined>(undefined);

export function useChats(): FullChatData {
	return useContext(ChatContext) as FullChatData;
}

export function ChatsProvider({
	children,
}: {
	children?: JSX.Element | JSX.Element[];
}) {
	const user = useMainUser();
	const { search } = usePageData();

	const [friends, setFriends] = useState<PeerUser[]>([]);

	const data = new ChatData(user as UserContextValues, () => {
		setFriends(data.getFriends());
		console.log('Friends updated, now: ', data.getFriends());
	});

	return (
		<ChatContext.Provider value={{ room: search.get('room'), data, friends }}>
			{children}
		</ChatContext.Provider>
	);
}
