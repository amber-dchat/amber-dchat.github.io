import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';
import { db } from '@/hooks/user/useMainUser';

// This was a pain to debug. I hope it was worth it ...
export function getUser(alias: string) {
	return PeerUser.fetch(alias, db);
}
