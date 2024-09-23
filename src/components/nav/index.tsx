import {
	NavigationMenu,
	NavigationMenuLink,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { navigate } from '@/routes/hooks';

import './index.css';
import { useMainUser } from '@/hooks/user/useMainUser';

export default function NavigationBar() {
	const user = useMainUser();

	// let react handle useMemo
	const logged = !!user?.userInfo?.isCurrentlyActive;

	return (
		<NavigationMenu style={{ display: 'flex' }}>
			<img src="/favicon.png" />
			<NavigationMenuLink
				onClick={() => navigate('/')}
				className={navigationMenuTriggerStyle({
					className: 'cursor-pointer mr-auto',
				})}
			>
				DChatt
			</NavigationMenuLink>

			<NavigationMenuLink
				onClick={() => navigate(logged ? '/chat' : '/login')}
				className={navigationMenuTriggerStyle({ className: 'cursor-pointer' })}
			>
				{logged ? 'Chat' : 'Login / SignUp'}
			</NavigationMenuLink>
		</NavigationMenu>
	);
}
