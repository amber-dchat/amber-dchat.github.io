import { TIMEOUT_DELAY } from '@/lib/Constants';

export class Util {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static createGunTimeoutRejection(
		message: string,
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
