import { IGunInstance } from 'gun';
import type { GunUserInstance } from '../../useMainUser';
import { Util } from '@/lib/utils/Utils/Util';

export interface UserInfo {
	username: string;
	avatar: string;
	displayName: string;
	bio: string;
	friends: string[]
}

export const UserKeys = {
	Username: 'alias',
	Bio: 'bio',
	DisplayName: 'display_name',
	Avatar: 'avatar',
	Friends: "friends"
} as const;

export interface ValidUserInfo {
	[UserKeys.Avatar]: string;
	[UserKeys.Bio]: string;
	[UserKeys.DisplayName]: string;
	[UserKeys.Username]: string;
	[UserKeys.Friends]: string;
}

export type UserKeys = (typeof UserKeys)[keyof typeof UserKeys];

export class BaseUser {
	_db: IGunInstance;

	_user: GunUserInstance;
	info?: UserInfo;

	constructor(db: IGunInstance, user: GunUserInstance, preventFetch = false) {
		this._db = db;
		this._user = user;

		if(!preventFetch) {
			(async () => {
				this.info = await this.refetch();
			})();
		}
	}

	async fetch(): Promise<UserInfo> {
		if (this.info) return this.info;
		else {
			const info = await this.refetch();
			this._setUserInfo(info);
			return info;
		}
	}

	_setUserInfo(info: UserInfo) {
		this.info = info;
	}

	// WARN: ONLY CALL WHEN USER CHANGES THEIR DATA
	async refetch(updateCache = false): Promise<UserInfo> {
		const bioPro = this.createPromiseGunGetUser(
			UserKeys.Bio,
		) as Promise<string>;
		const username = (await this.createPromiseGunGetUser<void>(
			UserKeys.Username,
		)) as string;
		const avatarPro = this.createPromiseGunGetUser(
			UserKeys.Avatar,
			`https://api.dicebear.com/7.x/notionists/svg/seed=${username}`,
		) as Promise<string>;
		const displaynamePro = this.createPromiseGunGetUser(
			UserKeys.DisplayName,
		) as Promise<string>;
		const friendsPro = this.createPromiseGunGetUser(
			UserKeys.Friends,
			[] as string[]
		) as Promise<string[]>;

		const [bio, avatar, displayName, friends] = await Promise.all([
			bioPro,
			avatarPro,
			displaynamePro,
			friendsPro
		]);

		const userData: UserInfo = {
			bio,
			avatar,
			displayName,
			username,
			friends
		};

		if(updateCache) this._setUserInfo(userData)

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
			const { clear } = Util.createGunTimeoutRejection("ERR_TIMEOUT: The user property get operation timeout", reject)

			this._user.get(key).once((d) => {
				clear()
				if (d) resolve(d);
				resolve(fallback);
			});
		});
	}
}
