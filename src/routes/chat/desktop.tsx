import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useChats } from './chatsProvider';
import { useEffect } from 'react';
import Chat from './components/chat';

export default function Desktop() {
	const chat = useChats();

	useEffect(() => {
		chat.getUser('@shisui').then(console.log);
	}, [chat]);

	return (
		<ResizablePanelGroup direction="horizontal" className="w-full h-full">
			<ResizablePanel
				className="h-full"
				minSize={15}
				defaultSize={15}
				maxSize={25}
			>
				This is sidebar
			</ResizablePanel>

			<ResizableHandle withHandle />

			<ResizablePanel className="h-full">
				<Chat />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
