import { ClientUser } from '@/hooks/user/helpers/User/ClientUser';
import type React from 'react';
import type { GunUserInstance } from '@/hooks/user/useMainUser';
import { ISEAPair, type GunUser, type IGunInstance } from 'gun';
import { UserKeys } from '@/hooks/user/helpers/Base/BaseUser';

export type SetUserStateHook = React.Dispatch<
	React.SetStateAction<ClientUser | undefined>
>;

export class AccountManager {
	_setUser: SetUserStateHook;
	_user: GunUserInstance;
	_db: IGunInstance;

	constructor(
		setUserInfo: SetUserStateHook,
		user: GunUserInstance,
		db: IGunInstance,
	) {
		this._setUser = setUserInfo;
		this._user = user;
		this._db = db;

		db.on('auth', async (ack: GunUser & { sea?: ISEAPair }) => {
			if (!ack.sea) {
				console.warn(
					'SEA (Security, encryption and authorization) systems not found on the user. Proceeding to log out',
				);
				return user.leave();
			}

			const client = new ClientUser(ack.sea, db, this._user, {
				preventFetch: true,
			});

			await client.refetch(true);

			setUserInfo(client);
		});
	}

	login(username: string, password: string) {
		return new Promise<undefined>((resolve, reject) => {
			this._user.auth(username, password, (ack) => {
				if ((ack as { err: string }).err) {
					reject((ack as { err: string }).err);
				}

				resolve(undefined);
			});
		});
	}

	async create(username: string, password: string) {
		const doesExists = await new Promise<boolean>((re) =>
			this._db.get(`~@${username}`).once((d) => re(!!d)),
		);

		return new Promise<undefined>((resolve, reject) => {
			if (doesExists)
				reject(
					'Unable to create a user account. User with this username already exists.',
				);

			this._user.create(username, password, (ack) => {
				if ((ack as { err: string }).err) {
					reject((ack as { err: string }).err);
				}

				this.login(username, password);

				this._user.get(UserKeys.DisplayName).put(username, () => {
					resolve(undefined);
				});
			});
		});
	}

	logout() {
		this._user.leave();
		this._setUser(undefined);
	}
}
