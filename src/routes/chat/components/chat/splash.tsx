import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { BsGithub } from 'react-icons/bs';

export default function Splash() {
	return (
		<div className="select-none flex flex-col text-center items-center justify-center gap-2 w-full h-full text-gray-500">
			<img
				src="/favicon.png"
				className="w-32 h-32 rounded-full grayscale mt-auto"
			/>
			<h1 className="text-2xl font-bold">Welcome to Amber</h1>
			<p className="text-sm">
				Amber is a decentralized chat application built on top of the gun
				database.
			</p>

			<p className="text-md mt-0 py-0">Sourced under the MIT license.</p>

			<div className="mt-2 flex space-x-1">
				<Button
					variant={'secondary'}
					onClick={() =>
						window.open(
							'https://github.com/amber-dchat/amber-dchat.github.io',
							'_blank',
						)
					}
				>
					<BsGithub className="mr-1" />
					Source Code
				</Button>

				<Button
					variant={'secondary'}
					onClick={() =>
						window.open('https://github.com/amber-dchat', '_blank')
					}
				>
					<BsGithub className="mr-1" />
					GitHub Org
				</Button>
			</div>

			<div className="mt-auto mb-3 flex">
				<Lock className="w-[0.875rem] mr-1" />
				<p>End to end encrypted</p>
			</div>
		</div>
	);
}
