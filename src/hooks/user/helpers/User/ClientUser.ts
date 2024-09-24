import { BaseUser, UserKeys } from '../Base/BaseUser';
import { SEA as EncryptionTools } from '@/lib/utils/Gun/SEA/SEA';
import { IGunInstance, ISEAPair } from 'gun';
import { type GunUserInstance } from '../../useMainUser';
import { createAvatar } from '@/lib/utils/Avatar/createAvatar';

type OnFriendsUpdateHandler = (friends: string[]) => void;

export class ClientUser extends BaseUser {
	_sea: ISEAPair;
	private _isListeningForFriends = false;
	public alias: string = "";
	public avatar: string = "";
	public bio: string = "";
	public display_name: string = "";

	constructor(sea: ISEAPair, db: IGunInstance, user: GunUserInstance) {
		super(db, user);
		this._sea = sea;
	}

	onFriendsUpdate(onUpdate: OnFriendsUpdateHandler, forceMultiple = false) {
		if(this._isListeningForFriends && !forceMultiple) return
		this._user.get("friends").on((data: string[] /* these are gun souls */) => onUpdate(data));
	}

	async loadAll() {
		const arr = Object.values(UserKeys);

		// For loop
		for (let i = 0; i < arr.length; i++) {
			const key = arr[i];

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(this as any)[key as any] = await this.createPromiseGunGetUser(key as any);
		}
	}

	encrypt(data: string, epub: string) {
		return EncryptionTools.encryptData(
			data,
			this._sea.epriv,
			this._sea.epub,
			epub,
		);
	}

	decrypt(data: string, epub: string) {
		return EncryptionTools.decryptMessage(
			data,
			this._sea.epriv,
			this._sea.epub,
			epub,
		);
	}

	async editUsername(name: string) {
		await this.createPromiseGunPutUser(UserKeys.Username, name);
	}

	async editDisplayName(name: string) {
		await this.createPromiseGunPutUser(UserKeys.DisplayName, name);
	}

	async editBio(bio: string) {
		await this.createPromiseGunPutUser(UserKeys.Bio, bio);
	}

	async editAvatar(file: File) {
		const av = await createAvatar(file);

		await this.createPromiseGunPutUser(UserKeys.Avatar, av);
	}
}
