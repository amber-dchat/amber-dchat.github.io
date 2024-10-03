import { IGunInstance } from 'gun';
import type { GunUserInstance } from '../../useMainUser';
import { Util } from '@/lib/utils/Utils/Util';

type UserFriends<T = true> = T extends boolean ? string[] : undefined;

export interface UserInfo<T = true> {
	username: string;
	avatar: string;
	displayName: string;
	bio: string;
	friends: UserFriends<T>;
	pub: string;
}

export const UserKeys = {
	Username: 'alias',
	Bio: 'bio',
	DisplayName: 'display_name',
	Avatar: 'avatar',
	Friends: 'friends',
	Pub: 'pub',
} as const;

export const profileDefault =
	'https://api.dicebear.com/7.x/notionists/svg/seed=${username}';

export interface ValidUserInfo {
	[UserKeys.Avatar]: string;
	[UserKeys.Bio]: string;
	[UserKeys.DisplayName]: string;
	[UserKeys.Username]: string;
	[UserKeys.Friends]: string;
	[UserKeys.Pub]: string;
}

export type UserKeys = (typeof UserKeys)[keyof typeof UserKeys];

export class BaseUser {
	_db: IGunInstance;

	_user: GunUserInstance;
	info?: UserInfo<true>;
	_friends: string[] = [];

	constructor(db: IGunInstance, user: GunUserInstance, preventFetch = false) {
		this._db = db;
		this._user = user;

		if (!preventFetch) {
			(async () => {
				this.info = await this.refetch(false, this._friends);
			})();
		}
	}

	/**
	 * THIS METHOD IS ONLY FOR THE LISTENER AND DOES NOT ACTUALLY UPDATE THE DATABASE. DONT USE IT UNLESS YOURE RETRO
	 */
	pushFriends(...friend: string[]) {
		this._friends.push(...friend);
		this.info?.friends.push(...friend);
	}

	async fetch(): Promise<UserInfo> {
		if (this.info) return this.info;
		else {
			const info = await this.refetch(false, this._friends);
			this._setUserInfo(info);
			return info;
		}
	}

	_setUserInfo(info: UserInfo) {
		this.info = info;
	}

	// WARN: ONLY CALL WHEN USER CHANGES THEIR DATA
	async refetch(
		updateCache = false,
		friends: string[] = [],
	): Promise<UserInfo> {
		const bioPro = this.createPromiseGunGetUser(
			UserKeys.Bio,
		) as Promise<string>;
		const username = (await this.createPromiseGunGetUser<void>(
			UserKeys.Username,
		)) as string;
		const avatarPro = this.createPromiseGunGetUser(
			UserKeys.Avatar,
			profileDefault.replace('${username}', username),
		) as Promise<string>;
		const displaynamePro = this.createPromiseGunGetUser(
			UserKeys.DisplayName,
		) as Promise<string>;

		const [bio, avatar, displayName] = await Promise.all([
			bioPro,
			avatarPro,
			displaynamePro,
		]);

		const userData: UserInfo = {
			bio,
			avatar,
			displayName,
			username,
			friends: Object.values(friends),
			pub: this._user.is?.pub as string,
		};

		if (updateCache) this._setUserInfo(userData);

		return userData;
	}

	get isCurrentlyActive(): boolean {
		return !!this._user.is;
	}

	createPromiseGunPutUser<T extends UserKeys>(key: T, value: ValidUserInfo[T]) {
		return new Promise<void>((resolve, reject) => {
			this._user.get(key).put(value, (ack) => {
				if ((ack as { err: string }).err) reject((ack as { err: string }).err);

				resolve();
			});
		});
	}

	createPromiseGunGetUser<T>(key: UserKeys, fallback?: T) {
		return new Promise((resolve, reject) => {
			// abort
			const { clear } = Util.createGunTimeoutRejection(
				'ERR_TIMEOUT: The user property get operation timeout',
				reject,
			);

			this._user.get(key).once((d) => {
				clear();
				if (d) resolve(d);
				resolve(fallback);
			});
		});
	}
}
