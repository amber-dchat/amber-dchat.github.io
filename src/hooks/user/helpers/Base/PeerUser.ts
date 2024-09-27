import { Util } from '@/lib/utils/Utils/Util';
import type { IGunInstance } from 'gun';
import { UserInfo, UserKeys } from './BaseUser';
import { db } from '../../useMainUser';

export type PeerData = {
	[UserKeys.Username]: string;
	[UserKeys.DisplayName]: string;
	[UserKeys.Bio]?: string;
	[UserKeys.Friends]?: Record<string, string>;
	[UserKeys.Avatar]?: string;
	epub: string;
	pub: string;
};

export async function getRawUser(alias: string, gun: IGunInstance) {
	return new Promise<PeerData>((resolve, reject) => {
		const { clear } = Util.createGunTimeoutRejection(
			'TIMEOUT PEER FETCH',
			reject,
		);
		const isFromPub = !alias.startsWith('@');
		gun.get(`~${alias}`).once((d) => {
			if (isFromPub) {
				clear();
				if(!d) {
					gun.get(`~${alias}`).once(data => {
						if(!data) {
							clear()
							reject("no users found")
						}
						clear()
						resolve(data)
					})
				} else {
					clear();
					resolve(d);
					return;
				}
			}
			gun.get(Object.keys(d._['>'])[0]).once((user) => {
				clear();
				resolve(user);
			});
		});
	});
}

export interface SerializePeerUser {
	info: UserInfo;
	epub: string;
	pub: string;
}

export class PeerUser {
	static async fetch(id: string, gun: IGunInstance) {
		return new PeerUser(await getRawUser(id, gun));
	}

	info: UserInfo;
	epub: string;
	pub: string;

	constructor(d: PeerData) {
		this.info = this._transformPeerData(d);

		this.pub = d.pub;
		this.epub = d.epub;
	}

	toGunUser() {
		return db.user(this.pub);
	}

	_transformPeerData(d: PeerData): UserInfo {
		const actualFriends = d[UserKeys.Friends] || { _: "" }

		return {
			username: d[UserKeys.Username],
			displayName: d[UserKeys.DisplayName],
			friends: Object.values(actualFriends) || [],
			bio: d[UserKeys.Bio] || '',
			avatar:
				d[UserKeys.Avatar] ||
				`https://api.dicebear.com/7.x/notionists/svg/seed=${d[UserKeys.Username]}`,
		};
	}

	async refresh() {
		const data = await getRawUser(this.pub, db);
		const info = this._transformPeerData(data);

		this.info = info;
		this.epub = data.epub;
		this.pub = data.pub;

		return this;
	}

	toJSON(): SerializePeerUser {
		return {
			info: this.info,
			epub: this.epub,
			pub: this.pub,
		};
	}

	toString() {
		return JSON.stringify(this.toJSON());
	}
}
