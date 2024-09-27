import { Button } from '@/components/ui/button';
import Chat from './components/chat';
import MobileSidebar from './components/sidebar/mobileSidebar';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function Mobile() {
	const [open, setOpen] = useState(false);

	return (
		<div className="h-full w-full flex flex-col">
			<MobileSidebar {...{ open, setOpen }} />

			<div className="flex w-full border-[1px] border-border mb-2">
				<Button
					variant={'outline'}
					className="rounded-none border-b-0 border-t-0"
					onClick={() => setOpen(true)}
				>
					<Menu className="h-6 w-6 opacity-100" />
				</Button>

				<h1></h1>
			</div>
			<Chat />
		</div>
	);
}
