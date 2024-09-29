import { Separator } from '@/components/ui/separator';
import { useChats } from '../../chatsProvider';
import { Button, buttonVariants } from '@/components/ui/button';
import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';
import { ClientUser } from '@/hooks/user/helpers/User/ClientUser';
import { useMainUser, UserContextValues } from '@/hooks/user/useMainUser';

import { RiUserAddLine } from 'react-icons/ri';

import { navigate } from '@/hooks';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getUser } from '@/lib/utils/Gun/Users/getUser';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { FaUserLargeSlash } from 'react-icons/fa6';

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

function Entry({
	user,
	main,
	you = false,
}: {
	user: PeerUser | ClientUser;
	main: ClientUser;
	you?: boolean;
}) {
	return (
		<div className="w-full flex space-x-1 overflow-x-hidden">
			<Button
				variant="ghost"
				className="justify-start w-full"
				onClick={() => navigate(`/?room=${user.info?.username}`, true)}
			>
				<img src={user.info?.avatar} className="w-6 h-6 mr-2 rounded-full" />
				<span>
					{user.info?.displayName || user.info?.username} {you && '(You)'}
				</span>
			</Button>
			{!you && (
				<Tooltip>
					<TooltipTrigger
						onClick={() => {
							if (user.info) main.removeFriend(user?.info?.pub);
						}}
						className={cn(
							buttonVariants({
								size: 'default',
								variant: 'secondary',
								className: 'w-10 h-10 p-[0.6rem]',
							}),
						)}
					>
						<FaUserLargeSlash className="h-8 w-8" />
					</TooltipTrigger>
					<TooltipContent>Remove from friend</TooltipContent>
				</Tooltip>
			)}
		</div>
	);
}

export default function Sidebar() {
	const { friends, data } = useChats();
	const { userInfo } = useMainUser() as UserContextValues;

	const input = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);

	return (
		<div className="overflow-y-scroll overflow-x-hidden flex flex-col w-full h-full px-2 py-2 space-y-2">
			<Entry user={userInfo as ClientUser} main={userInfo as ClientUser} you />
			<Separator />

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger className="w-full flex justify-start border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md">
					<RiUserAddLine className="h-5 w-5 mr-2" />
					Add Friend
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add a friend</DialogTitle>
						<DialogDescription>Add a friend to chat</DialogDescription>
					</DialogHeader>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							(async () => {
								const val = input.current?.value as string;

								//if (input.current) input.current.value = '';
								const user = await getUser(`@${val}`).then((d) => d.pub);

								data.user.userInfo
									?.addFriend(user)
									.then(() => {
										setOpen(false);
									})
									.catch(() => {
										toast('Failed to add friend');
									});
							})();
						}}
					>
						<Input ref={input} placeholder="Username" />

						<Button type="submit" className="w-full mt-3">
							Add
						</Button>
					</form>
				</DialogContent>
			</Dialog>
			{friends.map((friend) => (
				<Entry main={userInfo as ClientUser} key={friend.pub} user={friend} />
			))}
		</div>
	);
}
