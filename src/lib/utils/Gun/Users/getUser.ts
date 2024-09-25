import { type IGunInstance } from 'gun';
import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';

// This was a pain to debug. I hope it was worth it ...
export function getUser(alias: string, gun: IGunInstance) {
	return PeerUser.fetch(alias, gun)
}
