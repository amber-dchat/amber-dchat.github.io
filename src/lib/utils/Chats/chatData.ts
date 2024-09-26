// THIS IS A MOCK CHAT DATA FILE FOR UI DEVELOPMENT
import { PeerUser } from '@/hooks/user/helpers/Base/PeerUser';
import { UserContextValues } from '@/hooks/user/useMainUser';
import { getPeerCache } from '@/lib/Structs/Cache/PeerCache';

export interface Message {
	content: string;
	createdAt: number;
	soul: string;
}

export type Cache<T> = {
	[key: string]: T | undefined;
};

export class ChatData {
	user: UserContextValues;
	public chats: string[] = [];
	peerCache = getPeerCache();

	public message: Cache<Message> = {};
	public users: Cache<PeerUser> = {};

	constructor(user: UserContextValues) {
		this.user = user;
	}

	async getChats() {
		this.chats = ['ahqsoftwares', 'shisui'];
	}

	// This will likely explode once we add group DMs
	async refreshCache() {
		const refreshPromises = Object.keys(this.users);

		for (const alias of refreshPromises) {
			this.users[alias] = await this.peerCache.fetch(alias);
		}

		return this;
	}

	async getUser(uid: string): Promise<PeerUser> {
		if (this.users[uid]) {
			return this.users[uid];
		}

		const user = await this.peerCache.fetch(uid);

		return user;
	}
}
