import { GunUserInstance } from '../../useMainUser';

export const GUN_RPC_USER_KEY = 'rpcstate' as const;

export type RPCImage = {
	url: string;
	hover?: string;
};

export type RPCType = 'playing' | 'listening' | 'watching';

export type RPCButtons = {
	text: string;
	url: string;
};

export type RPCRaw = {
	name: string;
	hasImage: boolean;
	imageMainURL?: string;
	imageMainHover?: string;
	imageSubURL?: string;
	imageSubHover?: string;
	sub: string;
	hasButtons: boolean;
	buttonPrimaryText?: string;
	buttonPrimaryURL?: string;
	buttonSecondaryText?: string;
	buttonSecondaryURL?: string;
	hasStamps: boolean;
	stampStart?: number;
	stampEnd?: number;
	type: RPCType;
};

export type RPC = {
	name: string;
	images?: {
		main: RPCImage;
		sub?: RPCImage;
	};
	sub: string;
	buttons?: {
		primary: RPCButtons;
		secondary?: RPCButtons;
	};
	timestamp?: {
		start: Date;
		end?: Date;
	};
	type: RPCType;
};

// PLEASE: Clean before exit app
export class UserRPCManager {
	state: RPC | null = null;
	private user: GunUserInstance;

	constructor(user: GunUserInstance, state?: Promise<RPC> | RPC) {
		this.user = user;
		if (state) {
			if (state instanceof Promise) {
				(async () => {
					this.state = await state;
				})();
			} else {
				this.state = state;
			}
		}
	}

	set(state: RPC | null) {
		if (state === null) {
			this.user.get(GUN_RPC_USER_KEY).put(null);
		}
	}
}
