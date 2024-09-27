import type { ISEAPair } from 'gun';
import GunSEA from 'gun/sea';

export class ExperimentalSEA {
	static async encryptData(message: string, peerEpub: string, mySea: ISEAPair) {
		const secret = await GunSEA.secret(peerEpub, mySea);

		if (secret) return GunSEA.encrypt(message, secret);

		throw new Error('Unable to encrypt data');
	}

	static async decryptData(
		encrypted: string,
		peerEpub: string,
		mySea: ISEAPair,
	) {
		const secret = await GunSEA.secret(peerEpub, mySea);

		if (secret) return GunSEA.decrypt(encrypted, secret);

		throw new Error('Unable to decrypt data');
	}
}