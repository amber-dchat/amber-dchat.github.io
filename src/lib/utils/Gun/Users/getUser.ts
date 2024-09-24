import { type IGunInstance } from 'gun';
import { BaseUser } from '../../../../hooks/user/helpers/Base/BaseUser';
import { Util } from '../../Utils/Util';

export function getUser(alias: string, gun: IGunInstance) {
	return new Promise<BaseUser>((resolve, reject) => {
		// error timeout
		const { clear } = Util.createGunTimeoutRejection(
			"ERR_TIMEOUT: The operation 'async getUser' timeout",
			reject,
		);

		gun.get(`~@${alias}`).once((d) => {
			clear();
			resolve(new BaseUser(gun, d));
		});
	});
}
