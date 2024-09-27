// THIS IS A MOCK CHAT DATA FILE FOR UI DEVELOPMENT
import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';
import { ClientUser } from '@/hooks/user/helpers/User/ClientUser';
import { db, UserContextValues } from '@/hooks/user/useMainUser';
import { Cache } from '@/lib/structs/cache/cache';
import { getPeerCache } from '@/lib/structs/cache/PeerCache';
import { DMChannel } from '@/lib/structs/DMChannel/DMChannel';
import { Message } from '@/lib/structs/Message/Message';

export class ChatData {
	user: UserContextValues;
	public chats: PeerUser[] = [];
	public peerCache = getPeerCache();

	public messages: Cache<Message[]> = new Cache({
		prefix: 'msg-',
		size: Infinity,
	});

	public currentChannelCancel = () => { };

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

		this.currentChannelCancel();

		const channel = new DMChannel(
			this.user.userInfo as ClientUser,
			await this.peerCache.fetch(uid, true),
			db,
			async (msg) => {
				console.log("Message", msg.author);
				this.messages.get(uid)?.push(msg);
				update();
			},
		);
		this.currentChannelCancel = channel.listenToMessages();

		channel.listenToMessages()

		return channel;
	}

	getMessages(uid: string): Message[] {
		return this.messages.get(uid) || [];
	}
}
