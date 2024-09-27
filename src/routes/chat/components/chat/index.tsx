import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon } from 'lucide-react';
import { useRef } from 'react';
import { useChats } from '../../chatsProvider';
import Splash from './splash';
import { useMediaQuery } from '@/hooks/use-media-query';
import ChatBubbles from './chat';
import { useMessages } from '../../messagesProvider';

export default function Chat() {
	const textarea = useRef<HTMLTextAreaElement>(null);
	const { room } = useChats();
	const msg = useMessages();

	return (
		<div className="flex flex-col h-full w-full py-2">
			{/* Chats */}
			<div className="h-full overflow-y-auto overflow-x-clip w-full flex flex-col px-2">
				{room ? <ChatBubbles /> : <Splash />}
			</div>

			<Separator className="my-2" />

			{/* Chat Box */}
			<form
				className="min-h-10 max-h-10 md:max-h-40 flex w-full gap-2 px-2"
				onSubmit={(ev) => {
					ev.preventDefault();

					if (textarea.current) {
						const txt = textarea.current;

						const val = txt.value as string;
						txt.value = "";

						if (msg) {
							msg.channel?.send(val);
						}
					}
				}}
			>
				<Textarea
					className="resize-none md:max-h-40 md:field-size-content"
					placeholder={`Type your message here ${useMediaQuery('(min-width: 468px)') ? '(Markdown is supported)' : ''}`}
					required
					ref={textarea}
					minLength={1}
					maxLength={4096}
					onKeyDown={(e) => {
						if (e.key == 'Enter' && !e.shiftKey) {
							e.preventDefault();
							document
								.querySelector<HTMLButtonElement>('#ahqsoft_submit_btn')
								?.click();
						}
					}}
					disabled={!room}
				/>
				<Button
					disabled={!room}
					type="submit"
					id="ahqsoft_submit_btn"
					className="h-10 w-10 p-[0.6rem]"
				>
					<SendIcon className="h-8 w-8" />
				</Button>
			</form>
		</div>
	);
}
