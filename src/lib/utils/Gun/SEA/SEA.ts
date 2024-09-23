import GunSEA from 'gun/sea';

export class SEA {
	static async encryptData(
		data: string,
		privateKey: string,
		publicKey: string,
		peerPubKey: string,
	) {
		const secret = await GunSEA.secret(peerPubKey, {
			epriv: privateKey,
			epub: publicKey,
		});

		if (secret)
			return await GunSEA.encrypt(data, {
				epriv: privateKey,
			});

		throw new Error('Unable to decrypt message');
	}

	static async decryptMessage(
		data: string,
		privateKey: string,
		publicKey: string,
		peerPubKey: string,
	) {
		const secret = await GunSEA.secret(peerPubKey, {
			epriv: privateKey,
			epub: publicKey,
		});

		if (secret)
			return await GunSEA.decrypt(data, {
				epriv: privateKey,
			});

		throw new Error('Unable to decrypt message');
	}
}
