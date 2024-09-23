import {
	NavigationMenu,
	NavigationMenuLink,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { navigate } from '@/hooks';

import './index.css';
import { useMainUser, UserContextValues } from '@/hooks/user/useMainUser';

import { MdDarkMode, MdLightMode, MdOutlineLaptop } from "react-icons/md";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { HiOutlineRocketLaunch } from "react-icons/hi2";

import { Button } from '../ui/button';

import { useEffect, useState } from 'react';
import { getTheme, setTheme } from '@/utils/theme';
import { Login } from './login';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function NavigationBar() {
	const [theme, changeTheme] = useState(getTheme());
	const [open, setOpen] = useState(false);

	useEffect(() => setTheme(theme), [theme]);

	const user = useMainUser();

	// let react handle useMemo
	const logged = !!user?.userInfo?.isCurrentlyActive;

	useEffect(() => logged ? setOpen(false) : undefined, [logged]);


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

			<DropdownMenu>
				<DropdownMenuTrigger asChild className='flex justify-center text-center items-center'>
					<Button variant="ghost">
						{theme == "system" ? <MdOutlineLaptop size="1.5em" /> : theme == "true" ? <MdDarkMode size="1.5em" /> : <MdLightMode size="1.5em" />}
						<span className='ml-1 md:block hidden'>{theme == "system" ? "Theme" : theme == "true" ? "Dark" : "Light"}</span>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent>
					<DropdownMenuLabel>Theme</DropdownMenuLabel>

					<DropdownMenuRadioGroup value={theme} onValueChange={changeTheme}>
						<DropdownMenuRadioItem value="system">
							<MdOutlineLaptop /> <span className='ml-1'>System</span>
						</DropdownMenuRadioItem>

						<DropdownMenuRadioItem value="true">
							<MdDarkMode /> <span className='ml-1'>Dark</span>
						</DropdownMenuRadioItem>

						<DropdownMenuRadioItem value="false">
							<MdLightMode /> <span className='ml-1'>Light</span>
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<NavigationMenuLink
				onClick={() => !logged ? setOpen(true) : undefined}
				className={navigationMenuTriggerStyle({ className: `ml-1 cursor-pointer ${logged ? "hover:bg-transparent cursor-auto" : ""}` })}
			>
				{logged ? <></> : <HiOutlineRocketLaunch />}
				{logged ? <ProfileDropdown user={user} /> : <span className="ml-1">Get Started</span>}
			</NavigationMenuLink>
			<Login {...{ open, setOpen }} />
		</NavigationMenu>
	);
}

function ProfileDropdown({ user }: { user: UserContextValues | null }) {
	return (<DropdownMenu>
		<DropdownMenuTrigger asChild className='flex justify-center text-center items-center'>
			<Avatar className='border-2 rounded-full'>
				<AvatarImage src={user?.userInfo?.avatar || `https://robohash.org/${user?.userInfo?.alias}`} />
				<AvatarFallback>{user?.userInfo?.alias}</AvatarFallback>
			</Avatar>
		</DropdownMenuTrigger>

		<DropdownMenuContent>
			<DropdownMenuLabel>Hello {user?.userInfo?.display_name || user?.userInfo?.alias}</DropdownMenuLabel>
		</DropdownMenuContent>
	</DropdownMenu>);
}