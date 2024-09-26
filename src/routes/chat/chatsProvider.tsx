import { usePageData } from '@/hooks';
import { useMainUser, UserContextValues } from '@/hooks/user/useMainUser';
import { ChatData } from '@/lib/utils/Chats/chatData';
import { createContext, useContext } from 'react';

interface FullChatData {
	data: ChatData;
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

	const data = new ChatData(user as UserContextValues);

	return <ChatContext.Provider value={{ room: search.get("room"), data }}>{children}</ChatContext.Provider>;
}
