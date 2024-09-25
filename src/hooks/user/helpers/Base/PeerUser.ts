import { Util } from "@/lib/utils/Utils/Util";
import type { IGunInstance } from "gun";
import { UserInfo, UserKeys } from "./BaseUser";
import { db } from "../../useMainUser";

export type PeerData = {
    [UserKeys.Username]: string;
    [UserKeys.DisplayName]: string;
    [UserKeys.Bio]?: string;
    [UserKeys.Friends]?: string[];
    [UserKeys.Avatar]?: string;
    epub: string;
    pub: string;
}

export async function getRawUser(alias: string, gun: IGunInstance) {
    return new Promise<PeerData>((resolve, reject) =>{
        const { clear } = Util.createGunTimeoutRejection("TIMEOUT PEER FETCH", reject)
        const isFromPub = !alias.startsWith("@")
        gun.get(`~${alias}`).once((d) => {
            if(isFromPub) {
                clear()
                resolve(d)
                return
            }
            gun.get(Object.keys(d._[">"])[0]).once((user) => {
                clear()
                resolve(user)
            })
        });
    })
}

export interface SerializePeerUser {
    info: UserInfo;
    epub: string;
    pub: string;
}

export class PeerUser {
    static async fetch(id: string, gun: IGunInstance) {
        return new PeerUser(await getRawUser(id, gun), gun)
    }

    info: UserInfo
    epub: string;
    pub: string;

    _gun: IGunInstance

    constructor(d: PeerData, g: IGunInstance) {
        this.info = this._transformPeerData(d)

        this.pub = d.pub
        this.epub = d.epub

        this._gun = g
    }

    toGunUser() {
        return this._gun.user(this.pub)
    }

    _transformPeerData(d: PeerData): UserInfo {
        return {
            username: d[UserKeys.Username],
            displayName: d[UserKeys.DisplayName],
            friends: d[UserKeys.Friends] || [],
            bio: d[UserKeys.Bio] || "",
            avatar: d[UserKeys.Avatar] || `https://api.dicebear.com/7.x/notionists/svg/seed=${d[UserKeys.Username]}`
        }
    }

    async refresh() {
        const data = await getRawUser(this.info.username, this._gun)
        const info = this._transformPeerData(data)

        this.info = info
        this.epub = data.epub
        this.pub = data.pub

        return this
    }

    toJSON(): SerializePeerUser {
        return {
            info: this.info,
            epub: this.epub,
            pub: this.pub
        }
    }

    toString() {
        return JSON.stringify(this.toJSON())
    }

    static fromJSON(json: SerializePeerUser): PeerUser {
        const data: PeerData = {
            [UserKeys.Username]: json.info.username,
            [UserKeys.DisplayName]: json.info.displayName,
            [UserKeys.Friends]: json.info.friends,
            [UserKeys.Bio]: json.info.bio,
            [UserKeys.Avatar]: json.info.bio,
            epub: json.epub,
            pub: json.pub
        }
        
        return new PeerUser(data, db)
    }
}