import { BaseUser, UserKeys } from '../Base/BaseUser';
import { ExperimentalSEA as EncryptionTools } from '@/lib/utils/Gun/SEA/SEA';
import { IGunInstance, ISEAPair } from 'gun';
import { type GunUserInstance } from '../../useMainUser';
import { createAvatar } from '@/lib/utils/Avatar/createAvatar';

type ClientUserOptions = {
	preventFetch?: boolean;
};

type OnFriendsUpdateHandler = (friends: string[]) => void;

export class ClientUser extends BaseUser {
	_sea: ISEAPair;
	private _isListeningForFriends = false;
	rawGunUser = this._user

	constructor(
		sea: ISEAPair,
		db: IGunInstance,
		user: GunUserInstance,
		options?: ClientUserOptions,
	) {
		super(db, user, options?.preventFetch);
		this._sea = sea;
	}

	onFriendsUpdate(onUpdate: OnFriendsUpdateHandler, forceMultiple = false) {
		if (this._isListeningForFriends && !forceMultiple) return;
		const list = this._user.get('friends');

		list.on((data: string[] /* these are gun souls */) => onUpdate(data));

		return () => {
			list.off();
		};
	}

	encrypt(data: string, peerEpub: string) {
		return EncryptionTools.encryptData(data, peerEpub, this._sea);
	}

	decrypt(data: string, peerEpub: string) {
		return EncryptionTools.decryptData(data, peerEpub, this._sea);
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
