import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';
import { ClientUser } from '@/hooks/user/helpers/User/ClientUser';
import { formatDataStores } from '@/lib/Constants';
import { Util } from '@/lib/utils/Utils/Util';
import type { IGunInstance } from 'gun';
import { Message } from '../Message/Message';

export class DMChannel {
	client: ClientUser;
	peer: PeerUser;
	_db: IGunInstance;

	constructor(
		client: ClientUser,
		peer: PeerUser,
		db: IGunInstance,
		onMessageUpdate: (msg: Message) => void,
	) {
		this.client = client;
		this.peer = peer;
		this._db = db;

		db.get(this.__createChannelQuery())
			.map()
			.once((d) => {
				const message = new Message(d);
				onMessageUpdate(message);
			});
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
				resolve(new Message({ content, by: d }));
			});
		});
	}
}
