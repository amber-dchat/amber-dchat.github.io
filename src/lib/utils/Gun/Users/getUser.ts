import { type IGunInstance } from 'gun';
import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';
import { db } from '@/hooks/user/useMainUser';

// This was a pain to debug. I hope it was worth it ...
export function getUser(alias: string, gun: IGunInstance) {
	return PeerUser.fetch(alias, gun)
}

export function getUserByPub(pub: string) {
	return PeerUser.fetch(pub, db)
}