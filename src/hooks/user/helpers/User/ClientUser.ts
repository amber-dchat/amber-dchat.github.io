import { BaseUser, UserKeys } from '../Base/BaseUser';
import { SEA as EncryptionTools } from '@/lib/utils/Gun/SEA/SEA';
import { IGunInstance, ISEAPair } from 'gun';
import { type GunUserInstance } from '../../useMainUser';
import { createAvatar } from '@/lib/utils/Avatar/createAvatar';

export class ClientUser extends BaseUser {
	_sea: ISEAPair;

	constructor(sea: ISEAPair, db: IGunInstance, user: GunUserInstance) {
		super(db, user);
		this._sea = sea;
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
