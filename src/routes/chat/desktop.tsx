import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useChats } from "./chatsProvider";
import { useEffect } from "react";

export default function Desktop() {
  const chat = useChats();

  useEffect(() => {
    chat.getUser("@shisui").then(console.log);
  }, [chat])

  return <ResizablePanelGroup direction="horizontal" className="w-full h-full">
    <ResizablePanel className="h-full" minSize={15} defaultSize={15} maxSize={25}>
      This is sidebar
    </ResizablePanel>

    <ResizableHandle withHandle />

    <ResizablePanel className="h-full">
      This is chat area
    </ResizablePanel>
  </ResizablePanelGroup >
}