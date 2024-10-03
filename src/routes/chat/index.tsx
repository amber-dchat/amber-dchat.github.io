import { useMediaQuery } from '@/hooks/use-media-query';
import Desktop from './desktop';
import Mobile from './mobile';
import { ChatsProvider } from './chatsProvider';
import { Messages } from './messagesProvider';

import { TooltipProvider } from '@/components/ui/tooltip';

export default function Chat() {
	const desktop = useMediaQuery('(min-width: 1024px)');

	return (
		<ChatsProvider>
			<Messages>
				<TooltipProvider>{desktop ? <Desktop /> : <Mobile />}</TooltipProvider>
			</Messages>
		</ChatsProvider>
	);
}
