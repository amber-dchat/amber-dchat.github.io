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
import { useChats } from '../../chatsProvider';
import { navigate } from '@/hooks';

function Entry({ user, you = false, onClick }: { user: PeerUser | ClientUser, you?: boolean, onClick: () => void }) {
	return (
		<CommandItem onSelect={onClick}>
			<img src={user.info?.avatar} className="w-6 h-6 mr-2 rounded-full" />
			<span>{user.info?.displayName || user.info?.username || "Unknown"} {you && '(You)'}</span>
		</CommandItem>
	);
}

export default function CommandBar() {
	const { account, userInfo } = useMainUser() as UserContextValues;
	const [open, setOpen] = useState(false);

	const { friends } = useChats();

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
					<Entry user={userInfo as ClientUser} you onClick={() => {
						navigate(`/?room=${userInfo?.info?.username}`);
						setOpen(false);
					}} />

					{friends.map((friend) =>
						<Entry user={friend} key={`fri-${friend.pub}`} onClick={() => {
							navigate(`/?room=${friend.info?.username}`);
							setOpen(false);
						}} />
					)}
				</CommandGroup>

				<CommandGroup heading="Settings" className='mb-2'>
					<CommandItem
						accessKey="logout"
						onSelect={() => {
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
