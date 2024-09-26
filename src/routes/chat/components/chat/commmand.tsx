import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';
import { ClientUser } from '@/hooks/user/helpers/User/ClientUser';
import { useMainUser, UserContextValues } from '@/hooks/user/useMainUser';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

function Entry({ user }: { user: PeerUser | ClientUser }) {
	return (
		<CommandItem>
			<img src={user.info?.avatar} className="w-4 h-4 mr-2 rounded-full" />
			<span>{user.info?.displayName || user.info?.username}</span>
		</CommandItem>
	);
}

export default function CommandBar() {
	const { account, userInfo } = useMainUser() as UserContextValues;
	const [open, setOpen] = useState(false);

	useEffect(() => {
		window.addEventListener('keydown', (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key == 'k') {
				e.preventDefault();

				setOpen(true);
			}
		});
	}, []);

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Search" />

			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>

				<CommandGroup heading="Friends">
					<Entry user={userInfo as ClientUser} />
				</CommandGroup>

				<CommandGroup heading="Settings">
					<CommandItem
						accessKey="logout"
						onSelect={() => {
							console.log('Logout Clicked');
							account.logout();
						}}
					>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Logout</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
