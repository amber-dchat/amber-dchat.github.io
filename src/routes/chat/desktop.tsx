import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';

import Chat from './components/chat';
import CommandBar from './components/chat/commmand';
import Sidebar from './components/sidebar';

export default function Desktop() {
	return (
		<>
			<CommandBar />
			<ResizablePanelGroup direction="horizontal" className="w-full h-full">
				<ResizablePanel
					className="h-full"
					minSize={15}
					defaultSize={15}
					maxSize={25}
				>
					<Sidebar />
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel className="h-full">
					<Chat />
				</ResizablePanel>
			</ResizablePanelGroup>
		</>
	);
}
