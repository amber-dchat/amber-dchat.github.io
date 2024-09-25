import { useMediaQuery } from '@/hooks/use-media-query';
import Desktop from './desktop';
import Mobile from './mobile';
import { ChatsProvider } from './chatsProvider';

export default function Chat() {
	const desktop = useMediaQuery('(min-width: 768px)');

	return <ChatsProvider>{desktop ? <Desktop /> : <Mobile />}</ChatsProvider>;
}
