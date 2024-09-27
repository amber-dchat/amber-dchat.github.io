import './chat.css';

import { Skeleton } from '@/components/ui/skeleton';

import ReactMarkdown from 'react-markdown';
import { useEffect, useRef, useState } from 'react';
import { Copy, Lock, Pen, Trash2 } from 'lucide-react';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { toast } from 'sonner';
import { useMessages } from '../../messagesProvider';
import { ResolvedMessage } from '@/lib/utils/Chats/chatData';

function ChatEntry({ msg: { msg, author } }: { msg: ResolvedMessage }) {
	const [data, setData] = useState(false);
	const skeleton = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (skeleton.current) {
			const observer = new IntersectionObserver((ev) =>
				ev.forEach((ev) => {
					if (ev.isIntersecting) {
						observer.unobserve(skeleton.current as HTMLDivElement);
						setTimeout(() => {
							setData(true);
						}, 200);
					}
				}),
			);
			observer.observe(skeleton.current);
		}
	}, []);

	return !data ? (
		<Skeleton
			// @ts-expect-error ref does exist on Skeleton
			ref={skeleton}
			className="w-full h-16 min-h-16"
			onContextMenu={(e) => e.preventDefault()}
		/>
	) : (
		<ContextMenu>
			<ContextMenuTrigger>
				<div className="flex space-x-2 transition-colors md:hover:bg-secondary p-3 rounded-xl">
					<img
						src={author.info?.avatar}
						className="rounded-full w-16 h-16 cursor-pointer mt-1"
					/>
					<div className="w-full flex flex-col">
						<h1 className="flex w-full">
							<span className="cursor-pointer hover:underline mr-3 text-red-500">
								{author.info?.displayName || author.info?.username}
							</span>

							<span className="text-xs my-auto text-accent-foreground">
								{msg.timestamp.toLocaleString()}
							</span>

							<span className="select-none text-xs dark:text-gray-300 text-gray-600 ml-2">
								(Sending / Deleting not yet implemented)
							</span>
						</h1>

						<div className="markdown w-full overflow-x-clip">
							<ReactMarkdown>{msg.content}</ReactMarkdown>
						</div>
					</div>
				</div>
			</ContextMenuTrigger>

			<ContextMenuContent>
				<ContextMenuItem>
					<Pen className="h-4 w-4 mr-1" />
					Edit Message
				</ContextMenuItem>

				<ContextMenuItem
					onClick={() =>
						navigator.clipboard
							.writeText(msg.content)
							.then(() =>
								toast('Copied', {
									description: 'The message data has been copied to clipboard',
									dismissible: true,
								}),
							)
							.catch(() =>
								toast('Failed to copy', {
									description: 'Failed to copy the message data to clipboard',
									dismissible: true,
								}),
							)
					}
				>
					<Copy className="h-4 w-4 mr-1" />
					Copy
				</ContextMenuItem>

				<ContextMenuItem>
					<Trash2 className="h-4 w-4 mr-1" />
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

export default function ChatBubbles() {
	const chats = useRef<HTMLDivElement>(null);

	const msg = useMessages();

	useEffect(() => {
		if (chats.current) {
			chats.current.scrollTop = chats.current.scrollHeight;
		}
	}, []);

	return (
		<div
			className="flex flex-col w-full h-full space-y-1 overflow-x-hidden overflow-y-scroll pr-1 md:pr-3"
			ref={chats}
		>
			{msg ? (
				<>
					<div className="flex items-center mx-auto select-none px-4 py-2 bg-secondary hover:bg-accent rounded-lg cursor-pointer">
						<Lock className="h-4 w-4 mr-2" />
						This chat is end-to-end encrypted
					</div>

					{msg.messages.map((msg, i) => (
						<ChatEntry key={i + msg.msg.content} msg={msg} />
					))}
				</>
			) : (
				<>Error</>
			)}
		</div>
	);
}
