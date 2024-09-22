import { IGunInstance, IGunUserInstance, IGunInstanceRoot } from "gun";

export interface UserInfo {
    username: string,
    avatar: string,
    displayName: string,
    bio: string
}

export const UserKeys = {
    Username: "alias",
    Bio: "bio",
    DisplayName: "display_name",
    Avatar: "avatar",
} as const

export type UserKeys = typeof UserKeys[keyof typeof UserKeys]

export class BaseUser {
    _db: IGunInstance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _user: IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>
    info?: UserInfo

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(db: IGunInstance, user: IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>) {
        this._db = db;
        this._user = user;

        (async () => {
            this.info = await this.refetch()
        })()
    }

    async fetch(): Promise<UserInfo> {
        if (this.info) return this.info
        else {
            const info = await this.refetch()
            this.info = info
            return info
        }
    }

    // WARN: ONLY CALL WHEN USER CHANGES THEIR DATA
    async refetch(): Promise<UserInfo> {
        const bioPro = this.createPromiseGunCallsUser(UserKeys.Bio) as Promise<string>
        const username = await this.createPromiseGunCallsUser<void>(UserKeys.Username) as string
        const avatarPro = this.createPromiseGunCallsUser(UserKeys.Avatar, `https://api.dicebear.com/7.x/notionists/svg/seed=${username}`) as Promise<string>
        const displaynamePro = this.createPromiseGunCallsUser(UserKeys.DisplayName) as Promise<string>

        const [bio, avatar, displayName] = await Promise.all([bioPro, avatarPro, displaynamePro])

        return {
            bio,
            avatar,
            displayName,
            username
        }
    }

    get isCurrentlyActive(): boolean {
        return !!this._user.is
    }

    createPromiseGunCallsUser<T>(key: UserKeys, fallback?: T) {
        return new Promise((resolve) => {
            this._user.get(key).once((d) => {
                if (d) resolve(d)
                resolve(fallback)
            })
        })
    }
}