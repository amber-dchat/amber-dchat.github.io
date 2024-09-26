import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import Chat from './components/chat';

export default function Desktop() {
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
