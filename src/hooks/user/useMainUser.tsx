import GUN from 'gun/gun';
import {
	IGunInstance,
	IGunUserInstance,
	IGunInstanceRoot
} from 'gun';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed';
import 'gun/sea';
import { useState, useContext, createContext } from 'react';
import { ClientUser } from './helpers/User/ClientUser';
import { AccountManager } from '@/lib/utils/Gun/Accounts/Account';

export interface FetchUserData {
	alias: string;
	displayname: string;
	avatar: string;
	epub: string;
	pub: string;
	bio: string;
}

export interface UserContextValues {
	db: IGunInstance;
	userInfo?: ClientUser;
	account: AccountManager;
}

export type GunUserInstance = IGunUserInstance<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	IGunInstanceRoot<any, IGunInstance<any>>
>;

const UserContext = createContext<UserContextValues | null>(null);

export function useMainUser() {
	return useContext(UserContext);
}

const db = GUN({
	peers: [
		'https://gun-manhattan.herokuapp.com/gun',
		`https://gundb-relay-mlccl.ondigitalocean.app/gun`,
	], // TODO: Add our own servers instead of gun relays
	localStorage: false, // Only use indexeddb
});

const user = db.user().recall({ sessionStorage: true }) as GunUserInstance;

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [userInfo, setUserInfo] = useState<ClientUser>();

	const account = new AccountManager(setUserInfo, user, db);

	const values: UserContextValues = {
		db,
		userInfo,
		account,
	};

	return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
