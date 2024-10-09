'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { useMainUser, UserContextValues } from '@/hooks/user/useMainUser';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { ResponsiveDialog } from '../customDialog';
import { isTauri } from '@/routes/chat/isTauri';
import { Checkbox } from '../ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { IoWarningOutline } from 'react-icons/io5';

export function Login({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (a: boolean) => void;
}) {
	const [val, setVal] = React.useState('0');

	const title = val == '0' ? 'Login' : 'Sign Up';
	const desc =
		val == '0'
			? 'Lets log back in to your account'
			: 'Create a new account to get started';

	return (
		<ResponsiveDialog
			open={open}
			setOpen={setOpen}
			title={title}
			description={desc}
			header={
				<Tabs onValueChange={setVal} value={val} className="grid gap-2 my-4">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="0">Login</TabsTrigger>
						<TabsTrigger value="1">Signup</TabsTrigger>
					</TabsList>
				</Tabs>
			}
		>
			<ProfileForm className="" val={val} />
		</ResponsiveDialog>
	);
}

export function ProfileForm({
	className,
	val,
}: {
	className: string;
	val: string;
}) {
	const user = useMainUser() as UserContextValues;

	const [err, setErr] = React.useState('');
	const [remember, setRemember] = React.useState(isTauri);

	React.useEffect(() => setErr(''), [val]);

	const [isPending, start] = React.useTransition();

	const handleLogin = React.useMemo(
		() => (ev: React.FormEvent<HTMLFormElement>) => {
			start(async () => {
				ev.preventDefault();

				const [username, password] = Array.from(
					ev.currentTarget.querySelectorAll('input'),
				).map((el) => (el as HTMLInputElement).value);
				// Login
				if (val == '0') {
					try {
						await user.account.login(username, password);

						if (remember) {
							// TODO: Add some basic encryption later on
							localStorage.setItem('username', username);
							localStorage.setItem('password', password);
						}

						// eslint-disable-next-line @typescript-eslint/no-explicit-any
					} catch (e: any) {
						console.log(e);
						setErr(e);
					}
				}
				// Signup
				else {
					try {
						await user.account.create(username, password);

						// eslint-disable-next-line
					} catch (e: any) {
						console.log(e);
						setErr(e);
					}
				}
			});
		},
		[val, user.account, remember],
	);

	return (
		<form
			className={cn('grid items-start gap-4', className)}
			onSubmit={handleLogin}
		>
			{err != '' && (
				<div className="grid gap-1">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{err}</AlertDescription>
					</Alert>
				</div>
			)}
			<div className="grid gap-2">
				<Label htmlFor="username">Username</Label>
				<Input
					id="username"
					type="text"
					required
					minLength={3}
					maxLength={64}
					placeholder="Enter a username"
					autoComplete="username"
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					type="password"
					required
					minLength={8}
					placeholder={
						val == '0' ? 'Current password' : 'Enter a safe password'
					}
					autoComplete="current-password"
				/>
			</div>

			{isTauri && val == '0' && (
				<div className="flex items-center space-x-2">
					<Checkbox
						id="terms"
						checked={remember}
						disabled={isPending}
						onClick={() => setRemember((r) => !r)}
					/>
					<label
						htmlFor="terms"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex space-x-1"
					>
						Save Credentials
						<Tooltip>
							<TooltipTrigger type="button">
								<IoWarningOutline className="ml-1 w-4 h-4 text-yellow-600" />
							</TooltipTrigger>

							<TooltipContent>
								<p className="w-[30ch]">
									The username and password will be stored as plain text, which
									can be read by anyone with access to your user account.
								</p>
							</TooltipContent>
						</Tooltip>
					</label>
				</div>
			)}

			<Button type="submit" disabled={isPending}>
				{val == '0' ? 'Login' : 'Sign Up'}
			</Button>
		</form>
	);
}
