import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';
import { ClientUser } from '@/hooks/user/helpers/User/ClientUser';
import { formatDataStores } from '@/lib/Constants';
import { Util } from '@/lib/utils/Utils/Util';
import type { IGunInstance } from 'gun';
import { Message } from "../Message/Message";
import { getPeerCache } from '../cache/PeerCache';

export class DMChannel {
	client: ClientUser;
	peer: PeerUser;
	_db: IGunInstance;
	__onMessage: (msg: Message) => void;
	_isListening: boolean = false;
	private delisten1?: () => void;
	private delisten2?: () => void;

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

		return this.client.info?.friends.includes(refreshedPeer.pub)
	}

	/**
	 * @example ```ts
	 * const clean = db.listenToMessages()
	 * // run after messages listener is no longer needed 😎
	 * clean()
	 * ```
	 * @returns Event end function
	 */
	async listenToMessages() {
		if(this._isListening) return

		this._isListening = true

		const query = this.__createChannelQueryIndex()

		await new Promise<void>((resolve, reject) => {
			const { clear } = Util.createGunTimeoutRejection("check exists channel timeout", reject)
			this._db
				.get(query)
				.once((d) => {
					if(d) {
						clear()
						resolve()
					} else {
						this._db.get(query).put(0, (ack) => {
							if((ack as { err: string }).err) {
								clear()
								resolve()
							} else {
								clear()
								resolve()
							}
						})
					}
				})
		})

		let firstStart = true

		const indexListener = this._db
			.get(this.__createChannelQueryIndex())
			.on((d: number) => {
				const chatQuery = this.__createChannelQueryChat(d)
				if(d === 0) {
					this.delisten1 = this._db.get(chatQuery).map().on(msg => {
						
					}).off
					return
				} else {
					if(firstStart) {
						const chatQuery2 = this.__createChannelQueryChat(d - 1)
						this.delisten1 = this._db.get(chatQuery2).map().on(msg => {

						}).off
						this.delisten2 = this._db.get(chatQuery).map().on(msg => {

						}).off

						firstStart = false;
					} else {
						if(this.delisten1) {
							this.delisten1()
							this.delisten1 = this.delisten2
							this.delisten2 = this._db.get(chatQuery).map().on(msg => {
								
							}).off
						}
					}
				}
			})

		const listener = this._db
			.get(this.__createChannelQueryIndex())
			.map()
			.on(async (d) => {
				if (!d) return
				const decrypted = await this.client.decrypt(d.content, this.peer.epub);
				if(!decrypted?.trim()) return

				d.content = decrypted;
				d.timestamp = Util.getGunKey(d);
				const message = new Message(d);

				this.__onMessage(message);
			});

		return () => {
			this._isListening = false;
			if(this.delisten1) this.delisten1()
			if(this.delisten2) this.delisten2()
			indexListener.off()
			listener.off()
		};
	}

	__createChannelQueryIndex() {
		return formatDataStores(
			[this.client._sea.epub, this.peer.epub].sort().join("-connecting-"),
			'chat',
		);
	}

	__createChannelQueryChat(offset: number) {
		return formatDataStores(
			[this.client._sea.epub, this.peer.epub].sort().join("-chatting-") + offset,
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
			this.client._user.get('pub').once((d) => {
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
