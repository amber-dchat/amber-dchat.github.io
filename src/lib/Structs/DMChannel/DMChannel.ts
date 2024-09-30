import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';
import { ClientUser } from '@/hooks/user/helpers/User/ClientUser';
import { formatDataStores } from '@/lib/Constants';
import { Util } from '@/lib/utils/Utils/Util';
import type { IGunInstance } from 'gun';
import { Message, type MessageStructure } from '@/lib/Structs/Message/Message';
import { getPeerCache } from '@/lib/Structs/Cache/PeerCache';

export class DMChannel {
	client: ClientUser;
	peer: PeerUser;
	_db: IGunInstance;
	__onMessage: (msg: Message) => void;
	_isListening: boolean = false;
	private delisten1?: () => void;
	private delisten2?: () => void;
	currentIndex?: number;

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

		return this.client.info?.friends.includes(refreshedPeer.pub);
	}

	private async updateMessageListener(m: MessageStructure) {
		const message = await this.createMessage(structuredClone(m));
		if (!message) return;
		this.__onMessage(message);
	}

	private async createMessage(m: MessageStructure) {
		const decrypted = await this.client.decrypt(m.content, this.peer.epub);
		if (!decrypted.trim()) return null;
		m.content = decrypted;
		m.timestamp = Util.getGunKey(m);
		return new Message(m);
	}

	private createChatListener(query: string) {
		return this._db
			.get(query)
			.map()
			.on((msg) => this.updateMessageListener(msg)).off;
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
		if (this._isListening) return;

		this._isListening = true;

		const query = this.__createChannelQueryIndex();

		await new Promise<void>((resolve, reject) => {
			const { clear } = Util.createGunTimeoutRejection(
				'check exists channel timeout',
				reject,
			);
			this._db.get(query).once((d) => {
				if (d) {
					clear();
					resolve();
				} else {
					this._db.get(query).put(0, (ack) => {
						if ((ack as { err: string }).err) {
							clear();
							resolve();
						} else {
							clear();
							resolve();
						}
					});
				}
			});
		});

		let firstStart = true;

		// This is horrible code so I'm gonna try to explain it
		// P.S. if you decide to maintain it, add hours wasted to warn the next guy
		// Hours wasted: 8

		// Listen to indexing events
		const indexListener = this._db
			.get(this.__createChannelQueryIndex())
			.on((d: number) => {
				if(!d) return;
				// Set the current index to the database's index
				this.currentIndex = d;
				const chatQuery = this.__createChannelQueryChat(d);
				if (d === 0) {
					// d is 0 if its a new chat
					// 0 only needs 1 listener since there aren't more messages above
					this.delisten1 = this.createChatListener(chatQuery);
					return;
				} else {
					if (firstStart) {
						const chatQuery2 = this.__createChannelQueryChat(d - 1);
						// if the messages are querying for the first time, get 2 events
						if(this.delisten1) this.delisten1();
						else this.delisten1 = this.createChatListener(chatQuery2);
						this.delisten2 = this.createChatListener(chatQuery);

						firstStart = false;
					} else {
						// if not, swap the places of delisten1 and delisten2. dlisten2 is actually the newer one
						if (this.delisten1) {
							this.delisten1();
							this.delisten1 = this.delisten2;
							this.delisten2 = this.createChatListener(chatQuery);
						}
					}
				}
			});

		return () => {
			this._isListening = false;
			if (this.delisten1) this.delisten1();
			if (this.delisten2) this.delisten2();
			indexListener.off();
		};
	}

	__createChannelQueryIndex() {
		return formatDataStores(
			[this.client._sea.epub, this.peer.epub].sort().join('-connecting-'),
			'chat',
		);
	}

	__createChannelQueryChat(offset: number) {
		return this.__createChannelQueryIndex() + offset;
	}

	async send(content: string) {
		if (!this.currentIndex)
			throw new Error('Unable to send messages as listener is not invoked');
		// TODO: REWORK
		const index = new Date().toISOString();
		const secret = await this.client.encrypt(content, this.peer.epub);
		const query = this.__createChannelQueryChat(this.currentIndex);

		const amountOfMessages = await new Promise<number>((resolve, reject) => {
			const { clear } = Util.createGunTimeoutRejection(
				'Timeout of fetching message amount',
				reject,
			);

			this._db.get(query).once((current: Record<string, {}> | undefined) => {
				clear();
				resolve(!!current ? Object.keys(current).length : 0);
			});
		});

		if (amountOfMessages >= 25) {
			this.currentIndex++;
			this._db.get(this.__createChannelQueryIndex()).put(this.currentIndex);
		}

		const clientPub = await this.client.getPub();

		return new Promise((resolve, reject) => {
			const { clear } = Util.createGunTimeoutRejection(
				'Timeout of sending messages',
				reject,
			);

			if (!this.currentIndex) {
				clear();
				return reject('Unable to send messages as listener is not invoked');
			}

			this._db
				.get(this.__createChannelQueryChat(this.currentIndex))
				.get(index)
				.put(
					{
						content: secret,
						by: clientPub,
					},
					(ack) => {
						clear();
						if ((ack as { err: string }).err) {
							return reject(
								`Unable to send messages:\n${(ack as { err: string }).err}`,
							);
						}
						resolve(undefined);
					},
				);
		});
	}
}
