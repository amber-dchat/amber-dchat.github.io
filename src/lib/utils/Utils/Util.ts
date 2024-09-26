import { TIMEOUT_DELAY } from '@/lib/Constants';

export class Util {
	static createGunTimeoutRejection(
		message: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		reject: (reason: any) => void,
	) {
		const delay = setTimeout(() => {
			reject(message);
		}, TIMEOUT_DELAY);

		return {
			delay,
			clear: () => {
				clearTimeout(delay);
			},
		};
	}
}
