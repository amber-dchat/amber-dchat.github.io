import { BaseUser, UserKeys } from '../Base/BaseUser';
import { ExperimentalSEA as EncryptionTools } from '@/lib/utils/Gun/SEA/SEA';
import { IGunInstance, ISEAPair } from 'gun';
import { type GunUserInstance } from '../../useMainUser';
import { createAvatar } from '@/lib/utils/Avatar/createAvatar';
import { PeerUser } from '../Base/PeerUser';
import { getPeerCache } from '@/lib/Structs/Cache/PeerCache';
import { Util } from '@/lib/utils/Utils/Util';

type ClientUserOptions = {
	preventFetch?: boolean;
};

type OnFriendsUpdateHandler = (friends: PeerUser[]) => void;

export class ClientUser extends BaseUser {
	_sea: ISEAPair;
	private _isListeningForFriends = false;
	rawGunUser = this._user;

	constructor(
		sea: ISEAPair,
		db: IGunInstance,
		user: GunUserInstance,
		options?: ClientUserOptions,
	) {
		super(db, user, options?.preventFetch);
		this._sea = sea;
	}

	async addFriend(pub: string) {
		if (pub.startsWith("~")) pub = pub.replace("~", "")
		const cache = getPeerCache()

		const peer = await cache.fetch(pub);

		this._user.get("friends").get(peer.info.username).put(peer.pub);
	}

	async removeFriend(pub: string) {
		if (pub.startsWith("~")) pub = pub.replace("~", "")
		const cache = getPeerCache()

		const peer = await cache.fetch(pub);

		this._user.get("friends").get(peer.info.username).put("%removed%");
	}

	onFriendsUpdate(onUpdate: OnFriendsUpdateHandler, forceMultiple = false) {
		if (this._isListeningForFriends && !forceMultiple) return;

		this._isListeningForFriends = true;
		const list = this._user.get('friends');

		const cache = getPeerCache();

		list.on(async (d: Record<string, string> /* these are gun souls */) => {
			const data = JSON.parse(JSON.stringify(d)) as { [key: string]: string };
			delete data._

			const map = await Promise.all(
				Object.values(data).map((v) => {
					if (v.startsWith('~')) v = v.replace('~', '');
					return cache.fetch(v);
				}),
			);
			onUpdate(map);
		});

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

	getPub() {
		return new Promise<string>((resolve, reject) => {
			const { clear } = Util.createGunTimeoutRejection(
				'ClientUser pub timeout',
				reject,
			);

			this._user.get('pub').once((d) => {
				clear();
				resolve(d);
			});
		});
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
