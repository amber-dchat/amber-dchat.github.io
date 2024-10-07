import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';
import { getUser } from '@/lib/utils/Gun/Users/getUser';
import { Cache } from '@/lib/structs/cache/cache';

class PeerCache extends Cache<PeerUser> {
	constructor() {
		super({
			prefix: 'userkey',
		});
	}

	async fetch(peerPub: string, force = false) {
		if (peerPub.startsWith('~')) peerPub = peerPub.replace('~', '');

		if (!force) {
			let peer = this.get(peerPub);

			if (!peer) {
				peer = await getUser(peerPub);

				this.set(peer.pub, peer);
			}

			return peer;
		}

		return getUser(peerPub);
	}
}

let cache: PeerCache;

export function getPeerCache() {
	if (!cache) cache = new PeerCache();
	return cache;
}
