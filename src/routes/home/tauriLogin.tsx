import { ProfileForm } from '@/components/nav/login';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMainUser, UserContextValues } from '@/hooks/user/useMainUser';
import { useEffect, useState, useTransition } from 'react';

const delay = (ms: number) => new Promise((r) => setTimeout(() => r(null), ms));

export default function TauriLogin() {
	const [val, setVal] = useState('0');
	const [processing, start] = useTransition();

	const { account } = useMainUser() as UserContextValues;

	useEffect(() => {
		start(async () => {
			await delay(2000);
			const username = localStorage.getItem('username');
			const password = localStorage.getItem('password');

			if (username && password) {
				await account
					.login(username, password)
					.then(() => delay(1000))
					.catch(() => {});
			}
		});
	}, [account]);

	return (
		<div className="w-full h-full flex flex-col text-center items-center justify-center select-none">
			{processing ? (
				<>
					<img src="/favicon.png" className="rounded-full w-32 h-32" />
					<h1 className="absolute mt-[12rem] text-lg font-bold">
						Getting ready
					</h1>
				</>
			) : (
				<Card className="login_width">
					<CardHeader className="flex flex-col">
						<div className="flex w-full py-1 outline-1 outline-dashed rounded-md space-x-1 justify-center mb-2">
							<img
								src="/favicon.png"
								className="rounded-full w-7 h-7 mt-auto"
							/>
							<h1 className="text-lg">Amber DChat</h1>
						</div>
						<Tabs
							onValueChange={setVal}
							value={val}
							className="w-full grid gap-2 my-4"
						>
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="0">Login</TabsTrigger>
								<TabsTrigger value="1">Signup</TabsTrigger>
							</TabsList>
						</Tabs>
					</CardHeader>
					<CardContent>
						<ProfileForm className="" val={val} />
					</CardContent>
				</Card>
			)}
		</div>
	);
}
