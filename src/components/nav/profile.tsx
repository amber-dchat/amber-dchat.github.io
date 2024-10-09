import { useMainUser, UserContextValues } from '@/hooks/user/useMainUser';
import { ResponsiveDialog } from '../customDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { promptForAvatar } from '@/lib/utils/Avatar/createAvatar';

export function EditProfile({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (a: boolean) => void;
}) {
	const { userInfo } = useMainUser() as UserContextValues;

	const displayName = userInfo?.info?.displayName;
	const bio = userInfo?.info?.bio;

	return (
		<ResponsiveDialog
			open={open}
			setOpen={setOpen}
			title="Edit Your Profile"
			description="A reload is required to observe the changes"
		>
			<Tabs defaultValue="0" className="w-full">
				<TabsList className="w-full grid grid-cols-2">
					<TabsTrigger value="0">General</TabsTrigger>
					<TabsTrigger value="1">Avatar</TabsTrigger>
				</TabsList>

				<TabsContent value="0">
					<Card>
						<CardHeader>
							<CardTitle>General</CardTitle>
						</CardHeader>

						<CardContent className="space-y-2">
							<form
								className="space-y-2"
								onSubmit={(e) => {
									e.preventDefault();

									const actions = [];

									const IdisplayName = document.querySelector<HTMLInputElement>(
										'#displayName',
									)?.value as string;
									const IBio = document.querySelector<HTMLTextAreaElement>(
										'#bio',
									)?.value as string;

									if (IBio != bio) {
										actions.push(userInfo?.editBio(IBio));
									}

									if (IdisplayName != displayName) {
										actions.push(userInfo?.editDisplayName(IdisplayName));
									}

									Promise.all(actions)
										.then(() => {
											toast('Changes saved');
										})
										.catch(() => {
											toast('Failed to save all the changes');
										});
								}}
							>
								<div className="w-full">
									<Label htmlFor="displayName">Display Name</Label>
									<Input
										id="displayName"
										defaultValue={displayName}
										type="text"
										required
									/>
								</div>

								<div className="w-full">
									<Label htmlFor="bio">About</Label>
									<Textarea
										id="bio"
										placeholder="Describe about yourself"
										defaultValue={bio}
										maxLength={2048}
										minLength={20}
										className="resize-none h-40"
										required
									/>
								</div>

								<Button
									type="submit"
									variant={'default'}
									className="text-lg flex space-x-1 justify-center text-center items-center"
								>
									<Check />
									Submit
								</Button>
							</form>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="1">
					<Card>
						<CardHeader>
							<CardTitle>Avatar</CardTitle>
						</CardHeader>

						<CardContent className="space-y-2">
							<Button
								onClick={async () => {
									const file = await promptForAvatar();

									userInfo
										?.editAvatar(file)
										.then(() => {
											toast('Avatar updated');
										})
										.catch(() => {
											toast('Failed to update avatar');
										});
								}}
							>
								Upload Avatar
							</Button>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</ResponsiveDialog>
	);
}
