import { useMediaQuery } from '@/hooks/use-media-query';
import Desktop from './desktop';
import Mobile from './mobile';
import { ChatsProvider } from './chatsProvider';
import { Messages } from './messagesProvider';

export default function Chat() {
	const desktop = useMediaQuery('(min-width: 1024px)');

	return <ChatsProvider>
		<Messages>
			{desktop ? <Desktop /> : <Mobile />}
		</Messages>
	</ChatsProvider>;
}
