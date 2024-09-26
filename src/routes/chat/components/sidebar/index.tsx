import { Separator } from '@/components/ui/separator';
import { useChats } from '../../chatsProvider';
import { Button } from '@/components/ui/button';
import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';
import { ClientUser } from '@/hooks/user/helpers/User/ClientUser';
import { useMainUser, UserContextValues } from '@/hooks/user/useMainUser';

import { RiUserAddLine } from 'react-icons/ri';
import { navigate } from '@/hooks';

function Entry({
	user,
	you = false,
}: {
	user: PeerUser | ClientUser;
	you?: boolean;
}) {
	return (
		<Button
			variant="ghost"
			className="justify-start"
			onClick={() => navigate(`/?room=${user.info?.username}`)}
		>
			<img src={user.info?.avatar} className="w-6 h-6 mr-2 rounded-full" />
			<span>
				{user.info?.displayName || user.info?.username} {you && '(You)'}
			</span>
		</Button>
	);
}

export default function Sidebar() {
	const { friends } = useChats();
	const { userInfo } = useMainUser() as UserContextValues;

	return (
		<div className="overflow-y-scroll overflow-x-hidden flex flex-col w-full h-full px-2 py-2 space-y-2">
			<Entry user={userInfo as ClientUser} you />
			<Separator />

			<Button variant={'outline'} className="justify-start">
				<RiUserAddLine className="mr-2 w-5 h-5" />
				<span>Add Friend</span>
			</Button>
			{friends.map((friend) => (
				<Entry key={friend.pub} user={friend} />
			))}
		</div>
	);
}
