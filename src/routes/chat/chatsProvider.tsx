import { useMainUser, UserContextValues } from "@/hooks/user/useMainUser";
import { ChatData } from "@/lib/utils/Chats/chatData";
import { createContext, useContext } from "react";

const ChatContext = createContext<ChatData | undefined>(undefined);

export function useChats(): ChatData {
  return useContext(ChatContext) as ChatData;
}

export function ChatsProvider({ children }: { children?: JSX.Element | JSX.Element[] }) {
  const user = useMainUser();

  console.log(user);
  const data = new ChatData(user as UserContextValues);

  return <ChatContext.Provider value={data}>
    {children}
  </ChatContext.Provider>;
}