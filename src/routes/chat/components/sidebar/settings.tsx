import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/popover';
import { SettingsIcon } from 'lucide-react';

export default function Settings() {
	return (
		<Popover>
			<div className="w-full h-[3.45rem] flexspace-x-1 overflow-x-hidden px-2 py-1 mt-1">
				<Button variant={'ghost'} className="justify-start w-full flex">
					<SettingsIcon className="h-5 w-5 mr-2" /> Settings
				</Button>
			</div>
		</Popover>
	);
}
