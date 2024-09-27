import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';
import { ClientUser } from '@/hooks/user/helpers/User/ClientUser';
import { formatDataStores } from '@/lib/Constants';
import { Util } from '@/lib/utils/Utils/Util';
import type { IGunInstance } from 'gun';
import { Message } from '../Message/Message';
import { getPeerCache } from '../Cache/PeerCache';

export class DMChannel {
	client: ClientUser;
	peer: PeerUser;
	_db: IGunInstance;
	__onMessage: (msg: Message) => void;

	constructor(
		client: ClientUser,
		peer: PeerUser,
		db: IGunInstance,
		onMessageUpdate: (msg: Message) => void,
	) {
		this.client = client;
		this.peer = peer;
		this._db = db;

		this.__onMessage = onMessageUpdate;
	}

	async isMessageable() {
		const cache = getPeerCache();
		const refreshedPeer = await this.peer.refresh();

		cache.set(refreshedPeer.pub, refreshedPeer);

		// @ts-expect-error Flippinf shit
		return (await this.client.createPromiseGunGetUser("friends"))[await this.client.getPub()] != null;
	}

	/**
	 * @example ```ts
	 * const clean = db.listenToMessages()
	 * // run after messages listener is no longer needed 😎
	 * clean()
	 * ```
	 * @returns Event end function
	 */
	listenToMessages() {
		const listener = this._db
			.get(this.__createChannelQuery())
			.map()
			.once(async (d) => {
				const decrypted = await this.client.decrypt(d.content, this.peer.epub);
				d.content = decrypted;
				d.timestamp = Util.getGunKey(d);
				const message = new Message(d);
				this.__onMessage(message);
			});

		return listener.off;
	}

	__createChannelQuery() {
		return formatDataStores(
			`${this.client._sea.epub}-C-${this.peer.epub}`,
			'chat',
		);
	}

	async send(content: string) {
		const index = new Date().toISOString();
		const secret = await this.client.encrypt(content, this.peer.epub);

		return new Promise((resolve, reject) => {
			const { clear } = Util.createGunTimeoutRejection(
				'USER FETCH HAS TIMED OUT',
				reject,
			);
			this.client._user.get('pub').on((d) => {
				clear();
				this._db.get(this.__createChannelQuery()).get(index).put({
					content: secret,
					by: d,
				});
				resolve(undefined);
			});
		});
	}
}
