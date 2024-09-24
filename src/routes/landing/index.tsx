import { useMainUser } from '@/hooks/user/useMainUser';
import Chat from '../chat';
import Home from '../home';

import NavigationBar from '@/components/nav';
import { Separator } from '@/components/ui/separator';

export default function App() {
	const user = useMainUser();

	const loggedIn = user?.userInfo?.isCurrentlyActive;

	return (
		<div className='w-full h-full'>
			<NavigationBar />

			<Separator />

			<div className='h-[calc(100vh-5.06rem)]'>
				{loggedIn ? <Chat /> : <Home />}
			</div>
		</div>
	);
}
