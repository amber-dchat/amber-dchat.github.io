import { TIMEOUT_DELAY } from '@/oldlib/Constants';

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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static getGunKey(data: Record<string, any>) {
		return data._['#'];
	}
}
