// THIS IS A MOCK CHAT DATA FILE FOR UI DEVELOPMENT
import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';
import { ClientUser } from '@/hooks/user/helpers/User/ClientUser';
import { db, UserContextValues } from '@/hooks/user/useMainUser';
import { Cache } from '@/lib/Structs/Cache/Cache';
import { getPeerCache } from '@/lib/Structs/Cache/PeerCache';
import { DMChannel } from '@/lib/structs/DMChannel/DMChannel';
import { Message } from '@/lib/structs/Message/Message';

export class ChatData {
	user: UserContextValues;
	public chats: PeerUser[] = [];
	public peerCache = getPeerCache();

	public channels: Cache<DMChannel> = new Cache({
		prefix: 'ch-',
		size: Infinity,
	});
	public messages: Cache<Message[]> = new Cache({
		prefix: 'msg-',
		size: Infinity,
	});

	public currentCHannelCancel = () => { };

	constructor(user: UserContextValues, friendsUpdate: () => void) {
		this.user = user;

		this.user.userInfo?.onFriendsUpdate((friends) => {
			console.log('Fix', friends);
			this.chats = friends;

			friendsUpdate();
		});
	}

	getFriends() {
		return this.chats;
	}

	// This will likely explode once we add group DMs

	// OUT OF DATE
	refreshCache() { }

	async getChannel(uid: string, update: () => void): Promise<DMChannel> {
		this.messages.set(uid, []);

		this.currentCHannelCancel();
		const cache = this.channels.get(uid);

		if (cache) return cache;

		const channel = new DMChannel(
			this.user.userInfo as ClientUser,
			await this.peerCache.fetch(uid, true),
			db,
			async (msg) => {
				console.log("Message", msg);
				this.messages.get(uid)?.push(msg);
				update();
			},
		);
		this.currentCHannelCancel = channel.listenToMessages();

		channel.listenToMessages()

		return channel;
	}

	getMessages(uid: string): Message[] {
		return this.messages.get(uid) || [];
	}
}
