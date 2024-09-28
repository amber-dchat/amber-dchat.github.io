// THIS IS A MOCK CHAT DATA FILE FOR UI DEVELOPMENT
import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';
import { ClientUser } from '@/hooks/user/helpers/User/ClientUser';
import { db, UserContextValues } from '@/hooks/user/useMainUser';
import { getPeerCache } from '@/lib/structs/cache/PeerCache';
import { DMChannel } from '@/lib/structs/DMChannel/DMChannel';
import { Message } from '@/lib/structs/Message/Message';

export interface ResolvedMessage {
	author: PeerUser | ClientUser;
	msg: Message;
}

export class ChatData {
	user: UserContextValues;
	public chats: PeerUser[] = [];
	public peerCache = getPeerCache();

	public messages: ResolvedMessage[] = [];

	// Stores Channel
	public chPub: string | undefined;

	constructor(user: UserContextValues, friendsUpdate: () => void) {
		this.user = user;

		this.user.userInfo?.onFriendsUpdate((friends) => {
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

	async getChannel(uid: string, update: (msg: ResolvedMessage) => void): Promise<DMChannel> {
		if (this.chPub == uid) {
			throw new Error("Don't");
		}

		this.messages = [];

		const peer = await this.peerCache.fetch(uid, true);

		const channel = new DMChannel(
			this.user.userInfo as ClientUser,
			peer,
			db,
			async (msg) => {
				let pub: string;
				let author: ClientUser | PeerUser = this.user.userInfo as ClientUser;
				if (channel.peer.pub == msg.author) {
					author = channel.peer as PeerUser;
					pub = channel.peer.pub
				} else {
					pub = await (author as ClientUser).getPub()
				}

				// TODO: FIX THIS SHIT
				if(this.messages.find((v) => msg.author === pub && msg.content === v.msg.content && v.msg.timestamp.getTime() === msg.timestamp.getTime())) return

				this.messages.push({ author, msg });

				update({ author, msg });
			},
		);

		channel.listenToMessages()

		this.chPub = channel.peer.pub;
		return channel;
	}
}
